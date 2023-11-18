import React, { useEffect, useRef, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Paper, Box, IconButton, Button, Badge } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import '../Styles/CheckoutPage.css'

const CartSummaryComponent = ({ cartItems, shippingCost, total, removeFromCart, adjustQuantity, next, step, setFullCost }) => {
    // Helper function to format cost display
    const formatCost = (cost) => {
        return (typeof cost === 'number') ? `$${cost.toFixed(2)}` : cost;
    };
    const tax = total * 0.11;
    const validShippingCost = isNaN(shippingCost) ? 0 : Number(shippingCost);
    const grandTotal = total + validShippingCost + tax;
    const boxRef = useRef(null);
    const [showScrollIcon, setShowScrollIcon] = useState(false);

    useEffect(() => {
        if (cartItems.length < 2) {
            return;
        }
        const checkOverflow = () => {
            const isOverflowing = boxRef.current.scrollHeight > boxRef.current.clientHeight;
            setShowScrollIcon(isOverflowing);
        };
        // Check if the content is overflowing when the component mounts
        checkOverflow();

        // Optional: Re-check on window resize
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);
    const scrollToBottom = () => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
    };
    //useEffect to update the grandtotal to equal full cost
    useEffect(() => {
        setFullCost({
            subTotal: total,
            grandTotal: grandTotal,
            tax: Number(tax.toFixed(2)),
            shippingCost: validShippingCost,
        });
    }
        , [grandTotal])



    return (
        <div className='cartSummary-container' >


            <List disablePadding >
                <Box ref={boxRef} sx={{ maxHeight: '60vh', minHeight: '65vh', overflow: 'auto', mt: { xs: 1, sm: -2.5 }, mb: -1.25, }}>
                    <Typography sx={{ borderBottom: .1, my: 2, textAlign: 'center', }} variant="h6" gutterBottom>
                        Order Summary
                    </Typography>
                    {cartItems.length === 0 ? (

                        // This section renders when the cart is empty
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: "center", height: '50vh' }}>
                            <Typography align="center" sx={{ mt: 3, fontVariant: 'all-small-caps', fontSize: { xs: 16, sm: 20, md: 22 }, fontWeight: 100 }}>
                                Your Cart Is Empty!

                            </Typography>
                            <AiOutlineShoppingCart fontSize={60} />
                            <Button to="/shop" component={Link} sx={{ border: 1, width: '50%', borderRadius: 0, letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white' } }} > Start Shopping</Button>
                        </Box>
                    ) : (
                        cartItems.map((item, index) => (
                            <Box key={'product:' + index} sx={{ display: 'flex', mx: { xs: 2, sm: 5 }, my: 2 }}>
                                <Badge badgeContent={item.quantity} color="secondary">
                                    <img className='cart-img' src={item.img} alt={item.name} width={80} height={80} loading='lazy' />
                                </Badge>
                                <Box >
                                    <Box sx={{
                                        ml: 1,

                                    }}>
                                        <Typography sx={{
                                            fontWeight: 500,
                                            fontSize: 18,
                                            fontFamily: '"Avenir Next", sans-serif',
                                            fontVariantCaps: 'all-small-caps',
                                            lineHeight: { xs: 1 },
                                            width: { xs: 'auto', md: '100%' }
                                        }}
                                            variant="h6">{item.name}</Typography>
                                        <Typography sx={{ fontFamily: '"Avenir Next", sans-serif', fontWeight: 200, color: 'black', fontVariantCaps: 'all-small-caps', lineHeight: 1 }}>{item.specs}</Typography>

                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: { xs: '260px', md: '290px' } }}>
                                        <Typography sx={{ fontWeight: 100, color: 'gray', ml: 1, }}>${item.price.toFixed(2) * item.quantity}</Typography>
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

                        ))
                    )}
                </Box>
                {cartItems.length > 0 && (
                    <>
                        {showScrollIcon && (
                            <IconButton onClick={scrollToBottom} sx={{
                                position: 'absolute', right: { xs: '20vw', sm: '8vw' }, bottom: step !== 0 ? 225 : { xs: 360, sm: 290 }, backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: '50%',
                                border: '1px solid black'
                            }}>
                                <ArrowDownwardIcon />
                            </IconButton>
                        )}
                        {/*<Divider style={{ margin: '10px 0' }} className='cartSummary-cost-divider' />*/}
                        <Box className="cartSummary-cost">
                            <ListItem style={{ padding: '10px 0' }}>
                                <ListItemText primary="Subtotal" />
                                <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
                                    {formatCost(total)}
                                </Typography>
                            </ListItem>
                            <ListItem style={{ padding: '10px 0' }}>
                                <ListItemText primary="Shipping" />
                                <Typography variant="body2">
                                    {formatCost(shippingCost)}
                                </Typography>
                            </ListItem>

                            <ListItem style={{ padding: '10px 0' }}>
                                <ListItemText primary={
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                        Estimated Taxes
                                        <Tooltip title="The final tax and total will be confirmed by email or text after you place your order." arrow>
                                            <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1, cursor: 'pointer' }} />
                                        </Tooltip>
                                    </Box>
                                } />
                                <Typography variant="body2">{formatCost(tax)}</Typography>
                            </ListItem>

                            <ListItem style={{ padding: '10px 0' }}>
                                <ListItemText primary="Total" />
                                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                                    {formatCost(grandTotal)}

                                </Typography>
                            </ListItem>
                        </Box>
                        {step === 0 ?
                            <Box className="cartSummary-checkout-button">
                                <Button className='cart-checkout-button' component={Link} to='/shop' variant="outlined" sx={{ m: 1, width: { xs: '75%', sm: '45%', md: '40%' }, letterSpacing: 2, color: 'white', backgroundColor: '#283047', height: 56.5, "&:hover": { backgroundColor: '#FE6F49', border: 'none', }, textAlign: 'center' }}><span className='cartSummary-checkout-text'>Proceed  to </span> Checkout</Button>
                                {/*<button onClick={next} className="cart-proceed-button"><span className="cartSummary-checkout-text">Proceed </span> to Information</button>*/}
                                <Button onClick={next} variant="outlined" sx={{ m: 1, width: { xs: '75%', sm: '45%', md: '40%' }, letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white', } }}>Continue Shopping</Button>

                            </Box> : null}
                    </>
                )}

            </List>

        </div>

    );
};

export default CartSummaryComponent;
