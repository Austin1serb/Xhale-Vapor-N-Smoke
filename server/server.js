require('dotenv').config();
require('./config/mongoose.config');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const express = require('express');
const app = express();
const port = process.env.PORT;
const secretKey = process.env.JWT_SECRET_KEY; //
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const bodyParser = require('body-parser');

app.use(
    cors({
        origin: 'http://localhost:3000', // Replace with your front-end's origin
        credentials: true,
    }),
    express.json({ limit: "50mb" }),
    express.urlencoded({ limit: "50mb", extended: true }),
    (cookieParser()),
);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://maps.googleapis.com', 'https://js.squareup.com'],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'https://res.cloudinary.com'],
            connectSrc: ["'self'", 'https://connect.squareup.com'],
            frameSrc: ["'self'"], // If you use iframes
            objectSrc: ["'none'"],
            // Add other directives as needed
        },
    },
}));


const productRoutes = require('./routes/products.routes');
const orderRoutes = require('./routes/orders.routes');
const guestRoutes = require('./routes/guest.routes')
const customerRoutes = require('./routes/customers.routes');
const shippoRoutes = require('./routes/shippo.routes');
const { uploadToCloudinary } = require('./services/cloudinary');
const suggestionsRoutes = require('./routes/suggestions.routes');
const paymentRoutes = require('./routes/payment.routes');
const passwordResetRoutes = require('./routes/passwordReset.routes')
const contactRouter = require('./routes/contact.routes');


app.use('/api', passwordResetRoutes);
app.use("/api/", suggestionsRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use('/api/guest', guestRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadToCloudinary);
app.use('/api/shippo', shippoRoutes);
app.use(bodyParser.json());
app.use('/api/contact', contactRouter);




app.listen(port, () => console.log(`Listening on port: ${port}`));