import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Paper, Box, IconButton, Button } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const CartSummaryComponent = ({ cartItems, shippingCost, total, removeFromCart, adjustQuantity }) => {
    // Helper function to format cost display
    const formatCost = (cost) => {
        return (typeof cost === 'number') ? `$${cost.toFixed(2)}` : cost;
    };
    const tax = total * 0.11;
    const validShippingCost = isNaN(shippingCost) ? 0 : Number(shippingCost);
    const grandTotal = total + validShippingCost + tax;

    return (
        <Paper elevation={3} style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px' }}>
            {/*<Typography sx={{ borderBottom: .1, ml: -2.5, textAlign: 'center', backgroundColor: 'red' }} variant="h6" gutterBottom>
                Order Summary
            </Typography>*/}

            <List disablePadding sx={{}}>
                <Box sx={{ maxHeight: '60vh', overflow: 'auto', mt: -2.5, mb: -1.25 }}>
                    {cartItems.map((item, index) => (
                        <Box key={'product:' + index} sx={{ display: 'flex', m: { md: 5 }, }}>
                            <img className='cart-img' style={{ border: '.1px solid black', borderRadius: '5px' }} src={item.img} alt={item.name} width={80} height={80} loading='lazy' />
                            <Box >
                                <Box sx={{
                                    ml: 1,

                                }}>
                                    <Typography sx={{
                                        fontWeight: 500,
                                        fontSize: 18,
                                        fontFamily: '"Avenir Next", sans-serif',
                                        fontVariantCaps: 'all-small-caps',
                                        mb: -1,
                                        width: { xs: 'auto', md: '100%' }

                                    }}
                                        variant="h6">{item.name}</Typography>
                                    <Typography sx={{ fontFamily: '"Avenir Next", sans-serif', fontWeight: 200, color: 'black', fontVariantCaps: 'all-small-caps' }}>{item.specs}</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: { md: '290px' } }}>
                                    <Typography sx={{ fontWeight: 100, color: 'gray', ml: 1, }}>${item.price.toFixed(2)}</Typography>
                                    {/* Quantity Controls */}
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: "center" }}>
                                        <Box sx={{ border: 1, width: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <IconButton onClick={() => adjustQuantity(item._id, item.quantity - 1)}>
                                                <RemoveIcon sx={{ fontSize: 10 }} />
                                            </IconButton>
                                            <Typography sx={{ fontWeight: 100 }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton onClick={() => adjustQuantity(item._id, item.quantity + 1)}>
                                                <AddIcon sx={{ fontSize: 10 }} />
                                            </IconButton>
                                        </Box>


                                    </Box>
                                    {/* Remove Button */}
                                    <Box sx={{}}>
                                        <Button sx={{ fontSize: 12, color: '#0F75E0', textDecoration: 'underline' }} onClick={() => removeFromCart(item._id)}>Remove</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Divider style={{ margin: '10px 0' }} />
                <ListItem style={{ padding: '10px 0' }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
                        {formatCost(total)}
                    </Typography>
                </ListItem>
                <ListItem style={{ padding: '10px 0' }}>
                    <ListItemText primary="Shipping" />
                    <Typography variant="body2">{formatCost(shippingCost)}</Typography>
                </ListItem>

                <ListItem style={{ padding: '10px 0' }}>
                    <ListItemText primary="Estimated Taxes" />
                    <Typography variant="body2">{formatCost(tax)}</Typography>
                </ListItem>

                <ListItem style={{ padding: '10px 0' }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                        {grandTotal}

                    </Typography>
                </ListItem>

            </List>
        </Paper>
    );
};

export default CartSummaryComponent;
