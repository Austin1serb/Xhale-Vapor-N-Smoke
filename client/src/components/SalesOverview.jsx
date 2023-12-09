import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { axisClasses } from '@mui/x-charts';
import OrderDetails from './OrderDetails';



const SalesOverview = () => {

    const [salesData, setSalesData] = useState([]);
    const [products, setProducts] = useState(['']);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [recentAdmins, setRecentAdmins] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [guestData, setGuestData] = useState([]);
    const totalGuestOrders = guestData.reduce((total, guest) => total + guest.orders.length, 0);


    const handleOpenDialog = orderId => {
        setCurrentOrderId(orderId);
        setIsDialogOpen(true);
    };



    // Function to handle dialog close
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };






    const aggregateSalesData = (data) => {
        const aggregatedData = {};

        data.forEach(item => {
            const monthKey = `month_${item.month}`;
            if (!aggregatedData[monthKey]) {
                aggregatedData[monthKey] = {};
            }
            if (!aggregatedData[monthKey][item.productId]) {
                aggregatedData[monthKey][item.productId] = { ...item, totalQuantity: 0, totalAmount: 0 };
            }
            aggregatedData[monthKey][item.productId].totalQuantity += item.totalQuantity;
            aggregatedData[monthKey][item.productId].totalAmount += item.totalAmount;
        });

        return aggregatedData;
    };
    //faster than importing
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    // Function to transform and sort data for the chart
    const transformAndSortDataForChart = (aggregatedData) => {
        const transformedData = {};
        let previousMonthProducts = new Set(); // To keep track of products from the previous month

        Object.keys(aggregatedData).forEach(monthKey => {
            const monthNumber = parseInt(monthKey.split('_')[1], 10);
            const monthName = monthNames[monthNumber - 1]; // Convert month number to month name
            const products = Object.values(aggregatedData[monthKey]);
            products.sort((a, b) => b.totalAmount - a.totalAmount); // Sort by totalAmount

            // Initialize month data
            transformedData[monthKey] = { month: monthName };

            let currentMonthProducts = new Set(); // To keep track of products for the current month

            if (products.length > 0) {
                // Process existing products
                const topProducts = products.slice(0, 4); // Select top 4 products
                topProducts.forEach((product) => {
                    const productNameKey = `${product.name}`;
                    transformedData[monthKey][productNameKey] = product.totalAmount; // Or totalQuantity
                    currentMonthProducts.add(productNameKey);
                });
            }

            // Add missing products from the previous month with totalAmount 0
            previousMonthProducts.forEach(productName => {
                if (!currentMonthProducts.has(productName)) {
                    transformedData[monthKey][productName] = 0;
                }
            });

            // Update previousMonthProducts for the next iteration
            previousMonthProducts = new Set([...currentMonthProducts]);
        });


        return Object.values(transformedData);
    };





    const fetchData = async (url, signal) => {
        const response = await fetch(url, {
            method: 'GET',
            signal: signal,
            credentials: 'include', // Include credentials in the request
            headers: {
                'Content-Type': 'application/json',

            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }

        return response.json();
    };




    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        // Fetch all necessary data on component mount
        const fetchAllData = async () => {
            try {
                setLoading(true);



                // Fetch guest data
                const guestDataResponse = await fetchData('http://localhost:8000/api/guest', signal);
                setGuestData(guestDataResponse);



                // Fetch products
                const productData = await fetchData('http://localhost:8000/api/product', signal);
                setProducts(productData);
                setTotalProducts(productData.length);



                // Fetch orders
                const orderData = await fetchData('http://localhost:8000/api/order', signal);
                const sortedOrders = orderData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
                setRecentOrders(sortedOrders);
                setTotalOrders(orderData.length);
                setOrders(orderData);

                setTotalSales(orderData.reduce((sum, order) => sum + order.totalAmount.grandTotal, 0));
                setPendingOrders(orderData.filter(order => order.orderStatus === 'Pending').length);


                // Fetch customer data
                const customerData = await fetchData('http://localhost:8000/api/customer', signal);

                // Separate out admins from customers
                const admins = customerData.filter(customer => customer.isAdmin);
                const customers = customerData.filter(customer => !customer.isAdmin);

                // Set total and recent customers
                setTotalCustomers(customers.length);
                setRecentCustomers(customers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)).slice(0, 5));

                // Set total and recent admins
                setTotalAdmins(admins.length);
                setRecentAdmins(admins.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

                // Fetch top selling products
                const data = await fetchData('http://localhost:8000/api/order/best-sellers-six-months', signal);

                const aggregatedData = aggregateSalesData(data);
                const chartData = transformAndSortDataForChart(aggregatedData);

                setSalesData(chartData);


            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();

        return () => {
            controller.abort();
        };
    }, []);

    const chartSetting = {
        yAxis: [
            {
                label: 'Total Sales ($)',

            },


        ],
        width: 1000, // Adjust the width to fit your layout
        height: 500, // Adjust the height to fit your layout
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(50px, -190px) ',
                //rotate 90 degress



            },
            // Styling for Y-axis labels
            [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
                fontSize: '26px',
            },
        },
        xAxis: [
            {
                scaleType: 'band',
                dataKey: 'month',

            },
        ],
    };


    const valueFormatter = (value) => {
        // Convert string to number if necessary
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;

        // Check if the conversion resulted in a valid number
        if (!isNaN(numericValue)) {
            return `$${numericValue.toFixed(2)}`;
        } else {
            return 'N/A'; // Return a fallback value for invalid numbers
        }
    };



    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(0.2 * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    };


    const generateChartSeries = (salesData) => {
        let series = Object.keys(salesData[0] || {}).filter(key => key !== 'month').map((key, index) => ({
            dataKey: key,
            label: key,
            valueFormatter,
            color: ['#06B2AF', '#2E96FF', '#AA00C6', '#60009B'][index % 4]
        }));


        // Shuffle the series array
        return shuffleArray(series);
    };

    const chartSeries = generateChartSeries(salesData);




    if (loading) {
        return <Box><CircularProgress /></Box>;
    }
    const Legend = ({ series }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
                {series.map((serie, index) => (
                    <div key={index} style={{ margin: 15, display: 'flex', alignItems: 'center', }}>
                        <div style={{
                            width: 20,
                            height: 20,
                            backgroundColor: serie.color,
                            marginRight: 5,

                        }} />
                        <span>{serie.label}</span>


                    </div>
                ))}
            </div>
        );
    };


    return (
        <Box sx={{ m: 5 }}>
            <Typography p={3} textAlign={'center'} variant='h4'>SALES OVERVIEW</Typography>
            <Grid container spacing={3}>
                {/* Display summary widgets */}
                <Grid item xs={6} md={4} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Total Products:</Typography>
                            <Typography variant="body2">{totalProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Total Orders:</Typography>
                            <Typography variant="body2">{totalOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Total Sales:</Typography>
                            <Typography variant="body2">{totalSales.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Pending Orders:</Typography>
                            <Typography variant="body2">{pendingOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Total Admins: </Typography>
                            <Typography variant="body2">{totalAdmins}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Total Accounts:  </Typography>
                            <Typography variant="body2">{totalCustomers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={6} >
                    <Card>
                        <CardContent >
                            <Typography variant="body1" gutterBottom>Recent Customer Registrations: </Typography>
                            <Typography variant="body2"> {recentCustomers.map(customer => <li key={customer._id}>{customer.firstName} {customer.lastName} - {customer.email}</li>)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1">Guest Information:</Typography>
                            {/* Display guest data */}
                            {/*{guestData.map(guest => (
                                <Box key={guest._id}>*/}
                            <Typography variant="body2">
                                Total Guest Accounts: {guestData.length}
                            </Typography>
                            <Typography variant="body2">
                                Total Guest Orders: {totalGuestOrders}
                            </Typography>
                            <Typography variant="body2">

                            </Typography>


                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8} lg={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1">Latest Orders:</Typography>
                            {/* Display recent orders */}
                            {recentOrders.map(order => (
                                <Box key={order._id}>
                                    <Typography component={Button} onClick={() => handleOpenDialog(order._id)} variant="body2">
                                        Order ID: {order._id} • Order Status: <strong>{order.orderStatus}</strong>
                                    </Typography>
                                    {currentOrderId === order._id && (
                                        <OrderDetails
                                            order={order}
                                            open={currentOrderId === order._id}
                                            onClose={() => setCurrentOrderId(null)}
                                        />
                                    )}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>






                <Box style={{ marginTop: '40px', }}>
                    <Typography p={3} textAlign={'center'} variant='h5'>Best Sellers Data</Typography>
                    <Legend series={chartSeries} />
                </Box>
                <BarChart
                    dataset={salesData}
                    slotProps={{
                        legend: {
                            hidden: true,

                        },

                    }}

                    sx={{

                    }}
                    xAxis={[
                        {
                            scaleType: 'band',
                            dataKey: 'month',

                        },

                    ]}
                    series={chartSeries}
                    {...chartSetting}
                />
            </Grid>
        </Box>
    );
}
export default SalesOverview;