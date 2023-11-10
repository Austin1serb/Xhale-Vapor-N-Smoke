import React from 'react';
import { Box, Typography, Button, List, ListItem, IconButton, } from '@mui/material';
import { useCart } from './CartContext';  // Adjust the path based on your file structure
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { MdClose } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { Link } from 'react-router-dom';
const Cart = ({ setDrawerOpen }) => {
    const { cart, removeFromCart, adjustQuantity } = useCart();

    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);





    return (
        <Box sx={{}}>


            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', height: '78vh', }}>
                <Box>
                    {/* Cart Header */}
                    <Box className="cart-drawer__top"

                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px',
                            borderBottom: '1px solid #ccc',
                            backgroundColor: '#282F48',
                            color: 'white',
                            mt: -3,

                        }}>
                        <Typography sx={{ letterSpacing: 2, fontSize: 18, ml: { xs: 10, sm: 13, md: 13 }, }} className="type-subheading type-subheading--1" variant="h6">
                            YOUR CART
                        </Typography>
                        <IconButton sx={{}} className="cart-close-icon" onClick={() => setDrawerOpen(false)}>
                            <MdClose style={{ color: "white", fontSize: 32, }} />
                        </IconButton>
                    </Box>
                    <Box sx={{ maxHeight: { xs: '200px', sm: '415px' }, overflowY: 'auto', }}>
                        {cart.length === 0 ? (
                            // This section renders when the cart is empty
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: "center", height: 200 }}>
                                <Typography align="center" sx={{ mt: 3, fontVariant: 'all-small-caps', fontSize: { xs: 16, sm: 20, md: 22 }, fontWeight: 100 }}>
                                    Your Cart Is Empty!

                                </Typography>
                                <AiOutlineShoppingCart fontSize={60} />
                                <Button onClick={() => {
                                    setDrawerOpen(false); // Close the drawer
                                }} to="/shop" component={Link} sx={{ border: 1, width: '90%', borderRadius: 0, letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white' } }} > Start Shopping</Button>
                            </Box>
                        ) : (
                            <List>
                                {cart.map(item => (
                                    <ListItem key={item.product._id} divider>
                                        {/* Cart Item Details */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'space-between',


                                        }}>
                                            <img className='cart-img' style={{}} src={item.product.imgSource[0].url} alt={item.product.name} width={100} height={100} loading='lazy' />
                                            <Box >
                                                <Box sx={{
                                                    ml: 1,

                                                }}>
                                                    <Typography sx={{
                                                        fontWeight: 600,
                                                        fontFamily: '"Avenir Next", sans-serif',
                                                        fontVariantCaps: 'all-small-caps',
                                                        mb: -1.5,
                                                        width: { xs: 'auto', md: 200 }

                                                    }}
                                                        variant="h6">{item.product.name}</Typography>
                                                    <Typography sx={{ width: '100px', fontFamily: '"Avenir Next", sans-serif', fontWeight: 400, color: 'gray', fontVariantCaps: 'all-small-caps' }}>{item.product.strength}</Typography>
                                                    <Typography sx={{ fontWeight: 100, mt: 2, color: 'gray' }}>${item.product.price.toFixed(2)}</Typography>
                                                </Box>
                                                {/* Quantity Controls */}
                                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 3, justifyContent: 'space-between', alignItems: "center" }}>
                                                    <Box sx={{ border: 1, width: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <IconButton onClick={() => adjustQuantity(item.product._id, item.quantity - 1)}>
                                                            <RemoveIcon sx={{ fontSize: 12 }} />
                                                        </IconButton>
                                                        <Typography sx={{ fontWeight: 200 }}>
                                                            {item.quantity}
                                                        </Typography>
                                                        <IconButton onClick={() => adjustQuantity(item.product._id, item.quantity + 1)}>
                                                            <AddIcon sx={{ fontSize: 12 }} />
                                                        </IconButton>
                                                    </Box>

                                                    {/* Remove Button */}
                                                    <Box sx={{ transform: { md: 'translateX(0px)', }, }}>
                                                        <Button sx={{ fontSize: 10, color: 'gray', textDecoration: 'underline' }} onClick={() => removeFromCart(item.product._id)}>Remove</Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Box>
                <Box>
                    {/* Notes for the seller */}
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: { xs: '40vh', sm: '30vh' },

                    }}>
                        <Box sx={{ borderTop: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="ajax-cart--checkout-add-note">
                            <Typography sx={{ textAlign: 'center', mt: { xs: 1, sm: 4 }, mb: { xs: 0, sm: 2 }, fontWeight: 100, fontSize: 14, color: 'gray', letterSpacing: 1 }}>Add a note for the seller…(optional)</Typography>
                            <textarea className='textareacart' />
                        </Box>

                        {/* Subtotal and checkout details */}
                        <Box className="ajax-cart--bottom-wrapper" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontWeight: 500, letterSpacing: 2 }}>SUBTOTAL </Typography>
                            <Typography sx={{ fontSize: 32, fontWeight: 100 }}>${total.toFixed(2)}</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 100, my: { xs: 1, sm: 4 }, textAlign: 'center' }} >Taxes and <a href='/' style={{ color: 'inherit' }}>shipping</a> calculated at checkout</Typography>

                            {cart.length > 0 && (
                                <>
                                    <Button component={Link} to='/checkout' onClick={() => setDrawerOpen(false)} variant="outlined" sx={{ width: { xs: '75%', sm: '90%', md: '90%' }, letterSpacing: 2, color: 'white', borderRadius: 0, backgroundColor: '#283047', mb: 4, height: 56.5, "&:hover": { backgroundColor: '#FE6F49', border: 'none' } }}>Place your order</Button>
                                    <Button onClick={() => {
                                        setDrawerOpen(false); // Close the drawer
                                    }} variant="outlined" sx={{ mb: 3, width: { xs: '75%', sm: '90%', md: '90%' }, letterSpacing: 2, color: '#283047', borderRadius: 0, backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white' } }}>Continue Shopping</Button>
                                </>
                            )}

                        </Box>
                    </Box>
                </Box>
            </Box>

        </Box >

    );
}

export default Cart;
