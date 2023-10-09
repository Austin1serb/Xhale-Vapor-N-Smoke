require('dotenv').config();
require('./config/mongoose.config'); 

const cors = require('cors')
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(cors(),express.json(),express.urlencoded({ extended: true }));

const customerRoutes = require('./routes/customers.routes');
const staffRoutes = require('./routes/staffers.routes');
const orderRoutes = require('./routes/orders.routes');
const productRoutes = require('./routes/products.routes');

app.use("/api/customer", customerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

app.listen(port, () => console.log(`Listening on port: ${port}`) );