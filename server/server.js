require('dotenv').config();
require('./config/mongoose.config'); 

const cors = require('cors')
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(cors(),express.json(),express.urlencoded({ extended: true }));

const customerRoutes = require('./routes/customers.routes');
const productRoutes = require('./routes/products.routes');
const staffRoutes = require('./routes/staffers.routes');

app.use("/api/customer", customerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/staff", staffRoutes);

app.listen(port, () => console.log(`Listening on port: ${port}`) );