require('dotenv').config();
require('./config/mongoose.config'); 

const cors = require('cors')
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(cors(),express.json(),express.urlencoded({ extended: true }));

const staffRoutes = require('./routes/staffers.routes');
const productRoutes = require('./routes/products.routes');
const orderRoutes = require('./routes/orders.routes');
const orderItemsRoutes = require('./routes/orderItems.routes');
const customerRoutes = require('./routes/customers.routes');
const cartRoutes = require('./routes/carts.routes');
const paymentRoutes = require('./routes/payments.routes');

app.use("/api/staff", staffRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderItems", orderItemsRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(port, () => console.log(`Listening on port: ${port}`) );