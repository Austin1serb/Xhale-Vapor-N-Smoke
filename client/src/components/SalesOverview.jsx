import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';

export default function MonthlySalesChart() {
    const [salesData, setSalesData] = useState([{}]);
    const [products, setProducts] = useState(['']); // State to store the products
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [recentAdmins, setRecentAdmins] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);

    useEffect(() => {
        // Fetch total number of admins
        fetch('http://localhost:8000/api/staff')
            .then(response => response.json())
            .then(data => {
                setTotalAdmins(data.length);
                // Sort and get the most recent 5 admins
                const recent = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
                setRecentAdmins(recent);
            });

        // Fetch total number of customers
        fetch('http://localhost:8000/api/customer')
            .then(response => response.json())
            .then(data => {
                setTotalCustomers(data.length);
                // Sort and get the most recent 5 customers
                const recent = data.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)).slice(0, 5);
                setRecentCustomers(recent);
            });
    }, []);
    useEffect(() => {
        fetch('http://localhost:8000/api/order')
            .then(response => response.json())
            .then(data => {
                // Sort by date and get the most recent 5 orders
                const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
                setRecentOrders(sortedOrders);
            });
    }, []);
    useEffect(() => {
        // Fetch total number of products
        fetch('http://localhost:8000/api/product')
            .then(response => response.json())
            .then(data => setTotalProducts(data.length));

        // Fetch total number of orders and other related metrics
        fetch('http://localhost:8000/api/order')
            .then(response => response.json())
            .then(data => {
                setTotalOrders(data.length);
                setTotalSales(data.reduce((sum, order) => sum + order.totalAmount, 0));
                setPendingOrders(data.filter(order => order.orderStatus === 'Pending').length);
            });
    }, []);

    useEffect(() => {
        // Fetch product information when the component mounts
        fetchProductData();
    }, []);

    const fetchProductData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/product');
            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }
            const productData = await response.json();
            setProducts(productData);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    useEffect(() => {
        // Fetch order data from your backend (replace with actual API call)
        fetch('http://localhost:8000/api/order')
            .then((response) => response.json())
            .then((data) => {
                // Create an object to store sales data for the last six months for each product
                const productSalesData = {};

                // Get the current date
                const currentDate = new Date();

                // Loop through the last six months
                for (let i = 0; i < 6; i++) {
                    // Calculate the date for the current month
                    const month = currentDate.getMonth() - i;
                    currentDate.setMonth(month);

                    // Format the month as 'MMMM' (e.g., 'January')
                    const formattedMonth = currentDate.toLocaleDateString('default', { month: 'long' });

                    // Initialize sales data for each product
                    productSalesData[formattedMonth] = {};

                    // Calculate sales for each product in this month
                    products.forEach((product) => {
                        const salesForProduct = data.filter((order) => {
                            // Check if any product in the order matches the desired product
                            return order.products.some((orderProduct) => orderProduct.product === product._id);
                        });

                        const salesAmount = salesForProduct.reduce((total, order) => {
                            return total + order.totalAmount;
                        }, 0);

                        // Log the values for debugging
                        console.log(`Month: ${formattedMonth}, Product: ${product.name}, Sales Amount: ${salesAmount}`);

                        productSalesData[formattedMonth][product.name] = salesAmount;
                    });
                }

                // Convert the productSalesData object to an array
                const salesDataArray = Object.entries(productSalesData).map(([month, productSales]) => ({
                    month,
                    ...productSales,
                }));

                setSalesData(salesDataArray);
            })
            .catch((error) => {
                console.error('Error fetching sales data:', error);
            });
    }, [products]);

    const chartSetting = {
        width: 500,
        height: 300,
        // Customize other chart settings as needed
    };

    return (
        <Box>
            {/* Display summary widgets */}
            <Typography variant="h6">Total Products: {totalProducts}</Typography>
            <Typography variant="h6">Total Orders: {totalOrders}</Typography>
            <Typography variant="h6">Total Sales: ${totalSales.toFixed(2)}</Typography>
            <Typography variant="h6">Pending Orders: {pendingOrders}</Typography>
            <Typography variant="h6">Total Admins: {totalAdmins}</Typography>
            <Typography variant="h6">Total Customers: {totalCustomers}</Typography>
            <Typography variant="h6">Recent Admin Registrations:</Typography>
            <ul>
                {recentAdmins.map(admin => <li key={admin._id}>{admin.username} - {admin.email}</li>)}
            </ul>
            <Typography variant="h6">Recent Customer Registrations:</Typography>
            <ul>
                {recentCustomers.map(customer => <li key={customer._id}>{customer.firstName} {customer.lastName} - {customer.email}</li>)}
            </ul>

            <Typography variant='h6' sx={{ textAlign: 'center' }}>
                <Box>Last Six Months Sales Data by Product</Box>
            </Typography>
            <Typography variant="h6">Latest Orders</Typography>
            {/* Display recent orders */}
            {recentOrders.map(order => (
                <Box key={order._id}>
                    <Typography variant="body1">Order ID: {order._id}</Typography>
                    {/* ... display other details */}
                </Box>
            ))}
            <BarChart
                dataset={salesData}
                xAxis={[
                    {
                        scaleType: 'band',
                        dataKey: 'month',
                    },
                ]}
                series={products.map((product) => ({
                    dataKey: product.name, // Use the product name as the label
                    label: product.name,
                }))}
                {...chartSetting}
            />
        </Box>
    );
}