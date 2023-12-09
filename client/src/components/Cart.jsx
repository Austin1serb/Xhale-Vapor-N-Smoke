import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, IconButton, Badge, } from '@mui/material';
import { useCart } from './CartContext';  // Adjust the path based on your file structure
import { Link } from 'react-router-dom';
import '../Styles/Shop.css'

const Cart = ({ setDrawerOpen }) => {

    const { cart, removeFromCart, adjustQuantity, updateNotes, notes, setNotes } = useCart();

    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const handleProceedToCheckout = () => {
        setDrawerOpen(false)
        updateNotes(notes);
    };
    const handleNoteChange = (event) => {
        setNotes(event.target.value); // Update note state when the textarea changes
    };


    return (
        <Box >


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
                        <Typography sx={{ letterSpacing: 2, fontSize: 18, ml: { xs: 5, sm: 13, md: 13 }, }} className="type-subheading type-subheading--1" variant="h6">
                            YOUR CART
                        </Typography>
                        <IconButton sx={{ transform: 'translate(0px, -7px)' }} className="cart-close-icon" onClick={() => setDrawerOpen(false)}>
                            {/* CLOSE ICON */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="30" width="30"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z" /></svg>
                        </IconButton>
                    </Box>
                    <Box sx={{ maxHeight: '415px', overflowY: 'auto', }}>
                        {cart.length === 0 ? (
                            // This section renders when the cart is empty
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: "center", height: { xs: 200, sm: 300 } }}>
                                <Typography align="center" sx={{ mt: { xs: 0, sm: 3 }, fontVariant: 'all-small-caps', fontSize: { xs: 16, sm: 20, md: 22 }, fontWeight: 100 }}>
                                    Your Cart Is Empty!

                                </Typography>
                                {/* CART ICON */}
                                <svg height='50' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                    <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z" />
                                </svg>
                                <Button onClick={() => {
                                    setDrawerOpen(false); // Close the drawer
                                }} to="/shop" component={Link} sx={{ border: 1, width: '90%', height: 50, borderRadius: 0, letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white' } }} > Start Shopping</Button>
                            </Box>
                        ) : (
                            <List>
                                {cart.map(item => (
                                    <ListItem key={item.product._id} divider>
                                        {/* Cart Item Details */}
                                        <Box sx={{
                                            display: 'flex',
                                            mt: 1

                                        }}>
                                            <Badge badgeContent={item.quantity} sx={{ '.MuiBadge-badge': { backgroundColor: 'rgba(195, 26, 210, 0.72)', color: 'white' } }}
                                            >
                                                <img className='cart-img1' src={item.product.imgSource[0].url}

                                                    alt={item.product.name} width={100} height={100} loading='lazy' />
                                            </Badge>
                                            <Box >
                                                <Box sx={{
                                                    ml: 1,

                                                }}>
                                                    <Typography sx={{
                                                        fontWeight: 600,
                                                        fontFamily: '"Avenir Next", sans-serif',
                                                        fontVariantCaps: 'all-small-caps',
                                                        mb: -1,
                                                        width: { xs: 'auto', md: 200 },
                                                        lineHeight: 1.1

                                                    }}
                                                        variant="h6">{item.product.name}</Typography>
                                                    <Typography sx={{ width: '100px', height: '20px', overflow: 'hidden', fontFamily: '"Avenir Next", sans-serif', fontWeight: 400, color: 'gray', fontVariantCaps: 'all-small-caps' }}>{item.product.specs}</Typography>
                                                    <Typography sx={{ fontWeight: 100, color: 'gray', }}>${item.product.price.toFixed(2)}</Typography>
                                                </Box>
                                                {/* Quantity Controls */}
                                                <Box sx={{ ml: -12.7, display: 'flex', flexDirection: 'row', mt: 3, pb: 1, justifyContent: 'space-between', alignItems: "center" }}>
                                                    <Box sx={{ borderRadius: '5px', border: .1, width: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <IconButton onClick={() => adjustQuantity(item.product._id, item.quantity - 1)}>
                                                            {/* SUBTRACT ICON */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z" /></svg>
                                                        </IconButton>
                                                        <Typography sx={{ fontWeight: 200 }}>
                                                            {item.quantity}
                                                        </Typography>
                                                        <IconButton onClick={() => adjustQuantity(item.product._id, item.quantity + 1)}>
                                                            {/* ADD ICON */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" /></svg>
                                                        </IconButton>
                                                    </Box>

                                                    {/* Remove Button */}
                                                    <Box sx={{ transform: { xs: 'translateX(-0px)', md: 'translateX(-25px)', }, }}>
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

                        boxShadow: ' 1px -4px 6px -1px rgba(0, 0, 0, 0.2)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '30vh',

                    }}>
                        <Box sx={{ borderTop: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="ajax-cart--checkout-add-note">
                            <Typography sx={{ textAlign: 'center', mt: { xs: 1, sm: 2 }, mb: { xs: 0, sm: 2 }, fontWeight: 100, fontSize: 14, color: 'gray', letterSpacing: 1 }}>Add a note for the seller…(optional)</Typography>
                            <textarea name='notes-for-seller' className='textareacart'
                                value={notes}
                                onChange={handleNoteChange} />
                        </Box>

                        {/* Subtotal and checkout details */}
                        <Box className="ajax-cart--bottom-wrapper" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontWeight: 500, letterSpacing: 2 }}>SUBTOTAL </Typography>
                            <Typography sx={{ fontSize: { xs: 22, sm: 32 }, fontWeight: 100, }}>${total.toFixed(2)}</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 100, textAlign: 'center' }} >Taxes and <Link to='/shipping-policy' style={{ color: 'inherit' }}>shipping</Link> calculated at checkout</Typography>

                            {cart.length > 0 && (
                                <>
                                    <Button component={Link} to='/checkout/1' onClick={handleProceedToCheckout} variant="outlined" sx={{ width: { xs: '75%', sm: '90%', md: '90%' }, letterSpacing: 2, color: 'white', borderRadius: 0, backgroundColor: '#283047', mb: { xs: 5, sm: 3 }, height: 56.5, "&:hover": { backgroundColor: '#FE6F49', border: 'none', }, textAlign: 'center' }}>Place your order</Button>
                                    <Button onClick={() => {
                                        setDrawerOpen(false); // Close the drawer
                                    }} variant="outlined" sx={{ mb: 1, width: { xs: '75%', sm: '90%', md: '90%' }, letterSpacing: 2, color: '#283047', borderRadius: 0, backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white' } }}>Continue Shopping</Button>
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
