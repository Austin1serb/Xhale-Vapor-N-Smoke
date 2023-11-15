const Orders = require('../models/orders.model')
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


}

