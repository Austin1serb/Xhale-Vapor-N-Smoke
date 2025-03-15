const Customer = require('../models/customers.model');
const Orders = require('../models/orders.model')
const Product = require('../models/products.model')
const moment = require('moment')
const nodemailer = require('nodemailer');


const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    // host: "smtp.office365.com",
    // port: 587,
    // secure: false,
    auth: {
        user: emailUsername,
        pass: emailPassword
    },
    // for office 365
    // tls: {
    //     ciphers: 'SSLv3'
    // }
});
function generateProductsHtml(orderDetails) {
    if (orderDetails && Array.isArray(orderDetails.products)) {
        return orderDetails.products.map(product => {
            const name = product.name || 'Unknown Product';
            const quantity = product.quantity || 0;
            const price = product.price || 0;
            const img = product.img || ''; // URL of the product image
            return `
            <div style="margin-bottom: 20px; display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <img src="${img}" alt="${name}" style="width: 80px; height: auto; margin-right: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="flex-grow: 1;">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${name}</div>
                    <div style="font-size: 14px; color: #555;">
                        Quantity: ${quantity}<br>
                        Price: $${price.toFixed(2)}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } else {
        console.error('orderDetails.products is undefined or not an array');
        return 'Error: orderDetails.products is undefined or not an array';
    }
}


async function sendReceiptEmail(orderDetails) {
    // Construct the list of products with quantities and prices

    let productsHtml = generateProductsHtml(orderDetails);
    console.log('orderDetails: ', orderDetails);

    let mailOptions2 = {
        from: emailUsername, // Your email address
        to: emailUsername, // Owner's email address
        subject: 'New Order Notification - HerbaNaturalCo',
        html: `
        <div style="font-family: Arial, sans-serif; color: #444; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">New Order Notification</h2>
            <hr style="border: 1px solid #ddd; margin: 15px 0;">
    
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}</p>
    
            <h3>Customer Information</h3>
            <ul>
                <li><strong>Name & Address:</strong> ${orderDetails.address}</li>
                <li><strong>Customer ID:</strong> ${orderDetails.customer}</li>
                <li><strong>Email:</strong> ${orderDetails.customerEmail}</li>
                <li><strong>Phone:</strong> ${orderDetails.customerPhone ? orderDetails.customerPhone : 'Not Provided'}</li>
            </ul>
    
            <h3>Product Details</h3>
            <ul>
                ${productsHtml}
            </ul>
    
            <h3>Order Notes</h3>
            <p>${orderDetails.orderNotes || 'No Order Notes'}</p>
    
            <h3>Total Amount</h3>
            <ul>
                <li><strong>Subtotal:</strong> $${orderDetails.totalAmount.subTotal.toFixed(2)}</li>
                <li><strong>Shipping Cost:</strong> $${orderDetails.totalAmount.shippingCost.toFixed(2)}</li>
                <li><strong>Tax:</strong> $${orderDetails.totalAmount.tax.toFixed(2)}</li>
                <li><strong>Total:</strong> $${orderDetails.totalAmount.grandTotal.toFixed(2)}</li>
            </ul>
    
            <h3>Payment Information</h3>
            <ul>
                <li><strong>Payment Status:</strong> ${orderDetails.paymentStatus}</li>
                <li><strong>Square Transaction ID:</strong> ${orderDetails.transactionId || 'N/A'}</li>
            </ul>
    
            <h3>Shipping Information</h3>
            <ul>
                <li><strong>Shipping Method:</strong> ${orderDetails.shippingMethod ? orderDetails.shippingMethod.carrier : 'N/A'}</li>
                <li><strong>Shipping Type:</strong> ${orderDetails.shippingMethod ? orderDetails.shippingMethod.type : 'N/A'}</li>
                <li><strong>Print Your Label</strong>  <a href=" ${orderDetails.shippingMethod ? orderDetails.shippingMethod.labelUrl : 'N/A'}"> Here</a></li>
                <li><strong>Estimated Shipping Date:</strong> ${orderDetails.estimatedShipping ? orderDetails.estimatedShipping : 'Unavailable'}</li>
                <li><strong>Tracking Number:</strong> ${orderDetails.shippingMethod ? orderDetails.shippingMethod.trackingNumber : 'N/A'}</li>
                <li><strong>Tracking Link:</strong> <a href="${orderDetails.shippingMethod ? orderDetails.shippingMethod.trackingUrl : '#'}">${orderDetails.shippingMethod ? 'Track Your Order' : 'N/A'}</a></li>
            </ul>

        </div>
    </div> `
    };
    // Send the email
    await transporter.sendMail(mailOptions2);

}




async function sendShippedEmail(orderDetails) {
    let productsHtml = generateProductsHtml(orderDetails);




    let mailOptions = {
        from: emailUsername,
        to: orderDetails.customerEmail,
        subject: 'Your Order Has Been Shipped - HerbaNaturalCo',
        html: `
       <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <div style="text-align: center;">
                    <img src="https://i.imgur.com/1TzCNZZ.png" style="width: 300px;" alt="Herba NaturalLogo" />
                    <h2 style="color: #4CAF50;">Delivered Successfully!</h2>
                </div>
                <p>Hi ${orderDetails.address.split(",")[0]},</p>
                <p>We're pleased to inform you that your order (Order Number: ${orderDetails.orderNumber}) has been successfully delivered to the following address:</p>
                <p><strong>${orderDetails.address}</strong></p>
                
                <h3 style="color: #333;">Items in Your Order:</h3>
                ${productsHtml}
                
                <p>If you have any questions or if there's anything further we can do for you, please don't hesitate to reply to this email or contact our customer service.</p>
                <p>Enjoy your products and thank you for choosing HerbaNaturalCo!</p>
                <p><strong>Didn't receive your order?</strong> If you have any issues with your delivery, please let us know immediately so we can assist you.</p>
                <p style="text-align: center; color: #00B824;">Warm regards,<br>The Herba NaturalTeam</p>
            </div>
        </div>
    `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

async function sendDeliveredEmail(orderDetails) {

    let productsHtml = generateProductsHtml(orderDetails);



    let mailOptions = {
        from: emailUsername,
        to: orderDetails.customerEmail,
        subject: 'Your Order Has Been Delivered - HerbaNaturalCo',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <div style="text-align: center;">
                    <img src="https://i.imgur.com/1TzCNZZ.png" style="width: 300px;" alt="Herba NaturalLogo" />
                    <h2 style="color: #4CAF50;">Delivered Successfully!</h2>
                </div>
                <p>Hi ${orderDetails.address.split(",")[0]},</p>
                <p>We're pleased to inform you that your order (Order Number: ${orderDetails.orderNumber}) has been successfully delivered to the following address:</p>
                <p><strong>${orderDetails.address}</strong></p>
                
                <h3 style="color: #333;">Items in Your Order:</h3>
                ${productsHtml}
                
                <p>If you have any questions or if there's anything further we can do for you, please don't hesitate to reply to this email or contact our customer service.</p>
                <p>Enjoy your products and thank you for choosing HerbaNaturalCo!</p>
                <p><strong>Didn't receive your order?</strong> If you have any issues with your delivery, please let us know immediately so we can assist you.</p>
                <p style="text-align: center; color: #00B824;">Warm regards,<br>The Herba NaturalTeam</p>
            </div>
        </div>
    `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

async function sendCanceledEmail(orderDetails) {
    let productsHtml = generateProductsHtml(orderDetails);

    let mailOptions = {
        from: emailUsername,
        to: orderDetails.customerEmail,
        subject: 'Your Order Has Been Canceled - HerbaNaturalCo',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <div style="text-align: center;">
                          <img src="https://i.imgur.com/1TzCNZZ.png" style="width: 300px;" alt="Herba NaturalLogo" />
                    <h2 style="color: #FF6347;">Order Cancellation Notice</h2>
                </div>
                <p>Dear ${orderDetails.address.split(",")[0]},</p>
                <p>We regret to inform you that your order (Order Number: ${orderDetails.orderNumber}) has been canceled. Here are the details:</p>
                
                <h3 style="color: #333;">Items in Your Order:</h3>
                ${productsHtml}
                
                <p>If you believe this was a mistake or have any questions, please contact us immediately at customerservices@herbanaturalco.com. We're here to help.</p>
                <p>We apologize for any inconvenience this may have caused and thank you for your understanding.</p>
                <p style="text-align: center; color: #00B824;">Warm regards,<br>The Herba NaturalTeam</p>
            </div>
        </div>
        `
    };

    // Send the email

    await transporter.sendMail(mailOptions);
}




module.exports = {


    createOne: async (req, res) => {
        try {

            const newOrder = new Orders(req.body);

            newOrder.orderNumber = newOrder._id; // Assign the _id to orderNumber
            const savedOrder = await newOrder.save();
            try {
                await sendReceiptEmail(savedOrder); // Await the email sending
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Decide how to handle email errors
            }


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




    updateOne: async (req, res) => {
        const orderId = req.params.id;
        const { orderStatus } = req.body;

        try {
            const updatedOrder = await Orders.findOneAndUpdate(
                { _id: orderId },
                { orderStatus },
                { new: true, runValidators: true }
            );

            if (orderStatus === 'Shipped') {
                await sendShippedEmail(updatedOrder);
            } else if (orderStatus === 'Delivered') {
                await sendDeliveredEmail(updatedOrder);
            } else if (orderStatus === 'Canceled') {
                await sendCanceledEmail(updatedOrder);
            }

            res.json(updatedOrder);
        } catch (err) {
            console.error('Error updating order:', err);
            res.status(400).json(err);
        }
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
            const { limit, month } = req.query; // Get the limit and month from query parameters

            // Validate the limit value
            if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
                return res.status(400).json({ error: 'Invalid limit value' });
            }

            // Define the date range for the query
            let startDate, endDate;
            if (month) {
                // If month is provided, calculate the start and end dates for that month
                const year = new Date().getFullYear();
                startDate = new Date(year, parseInt(month) - 1, 1);
                endDate = new Date(year, parseInt(month), 0);
            } else {
                // If no month is provided, use the last 6 months
                startDate = moment().subtract(6, 'months').toDate();
                endDate = new Date();
            }

            // MongoDB aggregation pipeline
            const bestSellers = await Orders.aggregate([
                {
                    $match: {
                        orderDate: { $gte: startDate, $lte: endDate }, // Filter orders based on date range
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

            res.json(result);
        } catch (error) {
            console.error('Error getting amount sold per month:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },




}




//function randomDate(start, end) {
//    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//}




//function generateUniqueId() {
//    // Implement a suitable method to generate unique IDs
//    return Math.floor(Math.random() * 10000000000).toString();
//}
//// Fetch users, products, and orders from your database (assuming Mongoose)
//async function fetchData() {
//    const users = await Customer.find().exec();
//    const products = await Product.find().exec();
//    const existingOrders = await Orders.find().exec();
//    return { users, products, existingOrders };
//}



//function createRandomOrder(users, products, existingOrders) {

//    // Select a random user and product
//    const user = users[Math.floor(Math.random() * users.length)];
//    const productTemplate = products[0];
//    const existingOrderTemplate = existingOrders[0]; // Use the first order as a template
//    console.log('productTemplate: ', productTemplate)

//    // Create a new order mimicking the structure of the existing one
//    const newOrder = {
//        customer: user._id,
//        customerEmail: user.email,
//        customerPhone: '121-232-2323',
//        products: [
//            {
//                name: productTemplate.name,
//                productId: productTemplate._id,
//                price: productTemplate.price.toFixed(2),
//                quantity: 2,
//                img: productTemplate.imgSource[0].url,

//            }
//        ],
//        address: "Austin Serb, 330 4th st, kirkland, wa, 98033, US",
//        shippingMethod: existingOrderTemplate.shippingMethod, // Copy from template or customize
//        totalAmount: {
//            grandTotal: 12.00,
//            subTotal: 8.00,
//            tax: 2.00,
//            shippingCost: 2.00,

//        }, // Calculate based on products or copy
//        orderStatus: "Pending", // Or randomize based on your needs
//        paymentStatus: "Pending", // Or randomize based on your needs
//        transactionId: generateUniqueId(),
//        createdBy: user._id,
//        createdByType: "Customer",
//        orderDate: randomDate(new Date(2023, 7, 1), new Date(2024, 0, 1)).toISOString(),
//        orderNumber: generateUniqueId(),
//    };

//    return newOrder;
//}

//// Assuming 'users', 'products', and 'existingOrders' are your provided arrays
//async function generateAndLogRandomOrder() {
//    const { users, products, existingOrders } = await fetchData();

//    if (users.length > 0 && products.length > 0 && existingOrders.length > 0) {
//        const newOrder = createRandomOrder(users, products, existingOrders);
//        console.log(newOrder);

//        // If you're ready to insert the new order into the database, do it here.
//        const savedOrder = await new Orders(newOrder).save();
//    } else {
//        console.log("Data is missing in one of the collections");
//    }
//}

//generateAndLogRandomOrder();

