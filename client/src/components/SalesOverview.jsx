import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';

export default function MonthlySalesChart() {
    const [salesData, setSalesData] = useState([{}]);
    const [products, setProducts] = useState(['']); // State to store the products

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
            <Typography variant='h6' sx={{ textAlign: 'center' }}>
                <Box>Last Six Months Sales Data by Product</Box>
            </Typography>
            {/*<BarChart
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
            />*/}
        </Box>
    );
}