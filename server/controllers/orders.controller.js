const Orders = require('../models/orders.model')
const Product = require('../models/products.model')
const moment = require('moment')




module.exports = {


    test: (req, res) => {
        res.json({ message: "Test order response!" });
    },
    getAllPaginate: async (req, res) => {
        const { page, perPage } = req.query;
        const offset = (page - 1) * perPage;
        const limit = parseInt(perPage);

        try {
            // Fetch orders from the database with pagination
            const orders = await Orders.find()
                .skip(offset)
                .limit(limit)
                .exec();

            // Count the total number of orders for pagination
            const totalOrdersCount = await Orders.countDocuments();

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalOrdersCount / limit);

            // Respond with paginated orders, total count, and total pages
            res.json({
                totalOrders: totalOrdersCount,
                totalPages,
                orders,
            });
        } catch (error) {
            console.error('Error fetching orders with pagination:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getAllAggregate: async (req, res) => {
        try {
            // Aggregate data to get total sales and items sold per month
            const monthlySales = await Orders.aggregate([
                {
                    $group: {
                        _id: { $month: "$orderDate" },
                        totalSales: { $sum: "$totalAmount" },
                        totalItemsSold: { $sum: { $size: "$products" } },
                    },
                },
            ]);

            res.json(monthlySales);
        } catch (error) {
            console.error('Error aggregating data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    getOne: (req, res) => {
        Orders.findOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    },
    createOne: async (req, res) => {
        try {
            const newOrder = new Orders(req.body);

            newOrder.orderNumber = newOrder._id; // Assign the _id to orderNumber
            const savedOrder = await newOrder.save();

            // Update totalSold for each product in the order
            for (const product of savedOrder.products) {
                const soldProduct = await Product.findById(product.productId);
                if (soldProduct) {
                    soldProduct.totalSold += product.quantity; // Increment totalSold
                    await soldProduct.save();
                } else {
                    console.error('Product not found:', product.productId);
                    // Handle the case where product is not found, if necessary
                }
            }

            res.json(savedOrder);
        } catch (err) {
            console.error('Error creating order:', err);
            res.status(400).json(err);
        }
    },



    updateOne: (req, res) => {
        Orders.findOneAndUpdate(
            { _id: req.params.id },
            {
                // Update other fields as needed
                orderStatus: req.body.orderStatus, // Assuming orderStatus is the field to be updated
            },
            { new: true, runValidators: true }
        )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                console.error('Error updating order:', err);
                res.status(400).json(err);
            });
    },


    getAll: (req, res) => {
        Orders.find()
            .then(data => { res.json(data) })
            .catch(err => res.json(err))
    },


    deleteOne: (req, res) => {
        Orders.deleteOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    },




    getTopSellingProducts: async (req, res) => {
        try {
            const { limit } = req.query; // Get the limit from the query parameters

            // Validate the limit value to ensure it's a positive integer (you can add more validation as needed)
            if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
                return res.status(400).json({ error: 'Invalid limit value' });
            }
            // Calculate the date 6 months ago from today
            const sixMonthsAgo = moment().subtract(6, 'months').toDate();

            // MongoDB aggregation pipeline
            const bestSellers = await Orders.aggregate([
                {
                    $match: {
                        orderDate: { $gte: sixMonthsAgo }, // Filter orders from the last 6 months
                    },
                },
                {
                    $unwind: '$products', // Split orders into separate documents for each product
                },
                {
                    $group: {
                        _id: '$products.productId', // Group by product ID
                        productName: { $first: '$products.name' }, // Get the product name
                        totalQuantitySold: { $sum: '$products.quantity' }, // Sum the quantity sold
                    },
                },
                {
                    $sort: {
                        totalQuantitySold: -1, // Sort by total quantity sold in descending order
                    },
                },
                {
                    $limit: parseInt(limit), // Limit the result to the top 3 best-selling products
                },
            ]);

            // Check if the product name is null for any items and retrieve it from Products
            for (const bestSeller of bestSellers) {
                if (!bestSeller.productName) {
                    const productInfo = await Product.findById(bestSeller._id);
                    if (productInfo) {
                        bestSeller.productName = productInfo.name;
                    }
                }
            }

            res.json(bestSellers);
        } catch (error) {
            console.error('Error getting best sellers:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },



    getAmountSoldPerMonthLast6Months: async (req, res) => {
        try {
            // Calculate the date 6 months ago from the current date
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            // Use MongoDB Aggregation to group orders by month and product
            const result = await Orders.aggregate([
                {
                    $match: {
                        orderDate: { $gte: sixMonthsAgo }, // Filter orders in the last 6 months
                    },
                },
                {
                    $unwind: '$products', // Split orders into separate documents for each product
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$orderDate' }, // Group by month
                            productId: '$products.productId', // Group by product ID
                        },
                        totalAmount: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
                        totalQuantity: { $sum: '$products.quantity' },
                    },
                },
                {
                    $sort: { '_id.month': 1 }, // Sort by month in ascending order
                },
                {
                    $project: {
                        month: '$_id.month', // Include month in the result
                        productId: '$_id.productId', // Include product ID in the result
                        totalAmount: 1, // Include total amount in the result
                        totalQuantity: 1, // Include total quantity in the result
                        _id: 0, // Exclude the default _id field
                    },
                },
            ]);
            for (const results of result) {
                if (!results.name) {
                    const productInfo = await Product.findById(results.productId);
                    if (productInfo) {
                        results.name = productInfo.name;
                    }
                }
            }
            console.log(result)
            res.json(result);
        } catch (error) {
            console.error('Error getting amount sold per month:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },






}

