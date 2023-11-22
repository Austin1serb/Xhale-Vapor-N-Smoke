import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, CircularProgress, Typography } from '@mui/material';
import DataChart from './DataChart';




const SalesOverview = () => {
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
    const [loading, setLoading] = useState(false);




    const fetchData = async (url, signal) => {
        const response = await fetch(url, { signal });
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

                // Fetch products
                const productData = await fetchData('http://localhost:8000/api/product', signal);
                setProducts(productData);
                setTotalProducts(productData.length);

                // Fetch orders
                const orderData = await fetchData('http://localhost:8000/api/order', signal);
                const sortedOrders = orderData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
                setRecentOrders(sortedOrders);
                setTotalOrders(orderData.length);

                setTotalSales(orderData.reduce((sum, order) => sum + order.totalAmount.grandTotal, 0));
                setPendingOrders(orderData.filter(order => order.orderStatus === 'Pending').length);

                // Fetch staff data
                const staffData = await fetchData('http://localhost:8000/api/staff', signal);
                setTotalAdmins(staffData.length);
                setRecentAdmins(staffData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

                // Fetch customer data
                const customerData = await fetchData('http://localhost:8000/api/customer', signal);
                setTotalCustomers(customerData.length);
                setRecentCustomers(customerData.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)).slice(0, 5));

                // Calculate sales data
                const salesData = calculateSalesData(productData, orderData);
                setSalesData(salesData);

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




    const productSalesData = {};
    function calculateSalesData(products, orders) {
        const currentDate = new Date();


        // Initialize the productSalesData object with product names
        products.forEach(product => {
            productSalesData[product.name] = Array(6).fill(0);
        });

        // Calculate sales data for the last six months
        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const monthDifference = (currentDate.getFullYear() - orderDate.getFullYear()) * 12 + currentDate.getMonth() - orderDate.getMonth();

            if (monthDifference < 6) {
                order.products.forEach(orderProduct => {
                    const productName = products.find(product => product._id === orderProduct.product)?.name;
                    if (productName) {
                        // Assuming order.totalAmount is the total for all products in the order, 
                        // you may need to adjust based on how the amount for each product is stored.
                        productSalesData[productName][monthDifference] += orderProduct.amount;
                    }
                });
            }
        });

        // Transform the data to the expected format for charting or further processing
        const salesDataArray = Object.keys(productSalesData).map(productName => {
            return {
                name: productName,
                sales: productSalesData[productName].reverse(), // reverse to get the array in chronological order
            };
        });

        return salesDataArray;
    }


    useEffect(() => {
        console.log(productSalesData)
    }, [])


    const chartSetting = {
        width: 500,
        height: 300,
        // Customize other chart settings as needed
    };


    if (loading) {
        return <Box><CircularProgress /></Box>; // Or any other loading spinner/animation
    }


    return (
        <Box sx={{ m: 5 }}>
            {/* Display summary widgets */}
            <Typography variant="h6">Total Products: {totalProducts}</Typography>
            <Typography variant="h6">Total Orders: {totalOrders}</Typography>
            <Typography variant="h6">Total Sales: ${totalSales}</Typography>
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
            <DataChart salesData={salesData} />
        </Box>
    );
}
export default SalesOverview;