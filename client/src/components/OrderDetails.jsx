import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const OrderDetails = ({ order }) => {


    return (
        <div>
            <Typography p={3} textAlign={'center'} variant='h5'>Order Details</Typography>
            <Typography variant="h6" gutterBottom>Order ID: {order.orderNumber} </Typography>
            <Grid container spacing={2}>
                {/* Customer Information */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Customer Details:</Typography>
                            <Typography variant="body2">Email: {order.customerEmail}</Typography>
                            <Typography variant="body2">Customer ID: {order.createdBy}</Typography>
                            <Typography variant="body2">{order.notes ? "Order Notes:" + order.notes : "No Order Notes"}</Typography>
                        </CardContent>
                    </Card>
                </Grid>


                {/* Order Total */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Order Total: ${order.totalAmount.grandTotal.toFixed(2)}</Typography>
                            <Typography variant="body2">Subtotal: ${order.totalAmount.subTotal.toFixed(2)}</Typography>
                            <Typography variant="body2">Tax: ${order.totalAmount.tax.toFixed(2)}</Typography>
                            <Typography variant="body2">Shipping: ${order.totalAmount.shippingCost.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Order Details */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Order Details: <strong> Status: {order.orderStatus}</strong></Typography>

                            <Typography variant="body2">Order Placed: {new Date(order.orderDate).toLocaleDateString()}</Typography>

                            <Typography variant="body2">Transaction Id: {order.transactionId}</Typography>
                        </CardContent>
                    </Card>
                </Grid>


                {/* Products in the Order */}
                <Grid item xs={12} md={6} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Products Ordered:</Typography>
                            {/* Map through products array to list them */}
                            {order.products.map((product, index) => (
                                <React.Fragment key={index}>
                                    <div style={{ display: 'flex', border: '0.1px solid black', borderRadius: '5px', padding: '5px', marginBottom: '5px' }}>
                                        <img loading='lazy' height={75} src={product.img} alt={index + 'product image'} />
                                        <div>
                                            <Typography variant="body2">
                                                Product: {product.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                Quantity: {product.quantity}
                                            </Typography>
                                            <Typography variant="body2">
                                                Price: ${product.price}
                                            </Typography>
                                            {index < order.products.length - 1 && <br />}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}

                        </CardContent>
                    </Card>
                </Grid>
                {/* Shipping Address */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Ship to:</Typography>
                            <Typography variant="body2">{order.address}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Shiping Method */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>Shipping Details:</Typography>

                            <Typography variant="body2">Provider: {order.shippingMethod.provider}</Typography>
                            <Typography variant="body2">Type: {order.shippingMethod.type}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Additional details can be added in a similar fashion */}
            </Grid>
        </div>
    );
};

export default OrderDetails;
