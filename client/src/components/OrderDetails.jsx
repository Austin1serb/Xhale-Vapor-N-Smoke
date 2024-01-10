import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';

const OrderDetails = ({ order, open, onClose }) => {


    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ backgroundColor: '#282F48', color: 'white', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '28px', }}>Order Details</span>
                <IconButton sx={{ transform: 'translate(0px, -7px)' }} className="cart-close-icon" onClick={onClose}>
                    {/* CLOSE ICON */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="35" width="35"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z" /></svg>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <div>

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
                                    <Typography variant="body1" gutterBottom>Order Total: ${order.totalAmount.grandTotal?.toFixed(2)}</Typography>
                                    <Typography variant="body2">Subtotal: ${order.totalAmount.subTotal?.toFixed(2)}</Typography>
                                    <Typography variant="body2">Tax: ${order.totalAmount.tax?.toFixed(2)}</Typography>
                                    <Typography variant="body2">Shipping: ${order.totalAmount.shippingCost?.toFixed(2)}</Typography>
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
                        {/* Shipping Details */}
                        <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="body1" gutterBottom>Shipping Details: <strong>{order.shippingMethod.provider} {order.shippingMethod.type}</strong></Typography>

                                    <Typography variant="body2">Print Label:
                                        <Button sx={{ height: '15px' }} onClick={() => window.open(order.shippingMethod.labelUrl)} >Get Label</Button>
                                    </Typography>


                                    <Typography variant="body2">Print Label:
                                        <Button sx={{ height: '15px' }} onClick={() => window.open(order.shippingMethod.trackingUrl)} >Tracking Details</Button>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Shipping Address */}
                        <Grid item xs={12} md={6} lg={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="body1" gutterBottom><strong>Ship to:</strong></Typography>
                                    <Typography variant="body2">{order.address}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Products in the Order */}
                        <Grid item xs={12} md={6} lg={4}>
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



                        <Grid sx={{ display: 'flex', justifyContent: 'end' }} item xs={12} md={12} lg={12}>

                            <Button variant='outlined' onClick={onClose}>Close</Button>


                        </Grid>
                        {/* Additional details can be added in a similar fashion */}
                    </Grid>

                </div>

            </DialogContent>
        </Dialog>




    );
};

export default OrderDetails;
