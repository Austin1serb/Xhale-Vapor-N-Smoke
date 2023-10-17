require('dotenv').config();
require('./config/mongoose.config');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const express = require('express');
const app = express();
const port = process.env.PORT;
const secretKey = process.env.JWT_SECRET_KEY; //

app.use(cors(), express.json({ limit: "50mb" }), express.urlencoded({ limit: "50mb", extended: true }));

const staffRoutes = require('./routes/staffers.routes');
const productRoutes = require('./routes/products.routes');
const orderRoutes = require('./routes/orders.routes');
const orderItemsRoutes = require('./routes/orderItems.routes');
const customerRoutes = require('./routes/customers.routes');
const cartRoutes = require('./routes/carts.routes');
const paymentRoutes = require('./routes/payments.routes');
const { uploadToCloudinary } = require('./services/cloudinary');

app.use("/api/staff", staffRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderItems", orderItemsRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadToCloudinary);

app.listen(port, () => console.log(`Listening on port: ${port}`));