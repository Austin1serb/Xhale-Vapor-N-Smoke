import React, { useEffect, useRef, useState } from 'react';
import ShippingDetailsComponent from './ShippingDetailsComponent';
import { Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Icon from '../components/Common/Icon';
import '../Styles/CheckoutPage.scss';
/* global Worldpay */

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};



const WorldpayPaymentForm = ({ shippingDetails, back, errors, total, isWorldpaySdkLoaded }) => {
    // Replace with your Worldpay Merchant ID or other relevant credentials
    const worldpayMerchantId = process.env.REACT_APP_WORLDPAY_MERCHANT_ID;
    const formRef = useRef(null);
    const clearRef = useRef(null);
    const [cardType, setCardType] = useState('');
    const cardCache = useRef(new Map()); // Simple cache
    const [cardDisplayNumber, setCardDisplayNumber] = useState('');
    const [cvc, setCvc] = useState('');
    const [maxCardLength, setMaxCardLength] = useState(19); // default to the longest possible length
    const [maxCvcLength, setMaxCvcLength] = useState(4); // default to the longest possible length
    const [name, setName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleExpiryDateChange = (event) => {
        let value = event.target.value;
        // Remove all non-digit characters
        const cleanedValue = value.replace(/\D+/g, '');

        // Format as MM/YY
        if (cleanedValue.length <= 2) {
            value = cleanedValue;
        } else if (cleanedValue.length <= 4) {
            value = cleanedValue.substring(0, 2) + '/' + cleanedValue.substring(2, 4);
        } else {
            value = cleanedValue.substring(0, 2) + '/' + cleanedValue.substring(2, 4);
        }

        setExpiryDate(value);
    };




    const handleNameChange = (event) => {
        console.log('sfsd')
        const words = event.target.value.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        setName(words.join(' '));
    };





    const validateCard = (number) => {
        // Check cache first
        if (cardCache.current.has(number)) {
            return cardCache.current.get(number);
        }
        if (number < 1) {
            setCardType('');

        }

        const cardTypes = [{
            brand: "visa",
            pattern: /^(?!^493698\d*$)4\d*$/,
            panLengths: [13, 16, 18, 19],
            cvvLength: 3
        }, {
            brand: "mastercard",
            pattern: /^(5[1-5]|222[1-9]|2720)\d*$/,
            panLengths: [16],
            cvvLength: 3
        }, {
            brand: "amex",
            pattern: /^3[47]\d*$/,
            panLengths: [15],
            cvvLength: 4
        }, {
            brand: "jcb",
            pattern: /^(35[2-8]|2131|1800|(308[8-9]|309[0-4])|(309[6-9]|310[0-2])|(311[2-9]|3120)|315[8-9]|(333[7-9]|334[0-9]))\d*$/,
            panLengths: [16, 17, 18, 19],
            cvvLength: 3
        }, {
            brand: "discover",
            pattern: /^(6011|64[4-9]|65)\d*$/,
            panLengths: [16, 19],
            cvvLength: 3
        }, {
            brand: "diners",
            pattern: /^(30([0-5]|95)|36|38|39)\d*$/,
            panLengths: [14, 16, 19],
            cvvLength: 3
        }, {
            brand: "maestro",
            pattern: /^(493698|(50[0-5][0-9]{2}|506[0-5][0-9]|5066[0-9])|(5067[7-9]|506[89][0-9]|50[78][0-9]{2})|5[6-9]|63|67)\d*$/,
            panLengths: [12, 13, 14, 15, 16, 17, 18, 19],
            cvvLength: 3
        }]
        // Add more card types as needed

        for (let card of cardTypes) {
            if (card.pattern.test(number)) {
                // Cache result and return card details including lengths
                cardCache.current.set(number, card.brand);
                return { brand: card.brand, maxCardLength: Math.max(...card.panLengths), maxCvcLength: card.cvvLength };
            }
        }
        return { brand: '', maxCardLength: 19, maxCvcLength: 4 };
    }
    const validateCardDebounced = debounce(validateCard, 100);

    const handleCardNumberChange = (event) => {
        let number = event.target.value;
        number = number.replace(/\D+/g, ''); // Remove non-digit characters
        if (number.length > maxCardLength) {
            number = number.slice(0, maxCardLength);
        }
        const formattedNumber = number.replace(/(\d{4})(?=\d)/g, '$1 - '); // Add dashes

        setCardDisplayNumber(formattedNumber);

        const cardDetails = validateCard(number);
        setCardType(cardDetails.brand);
        setMaxCardLength(cardDetails.maxCardLength);
        setMaxCvcLength(cardDetails.maxCvcLength);


        validateCardDebounced(number, (brand) => {
            setCardType(brand); // Update card type asynchronously
            console.log("brand:", brand)
        });
    };
    const handleCvcChange = (event) => {
        let cvcValue = event.target.value;
        cvcValue = cvcValue.replace(/\D+/g, ''); // Remove non-digit characters
        if (cvcValue.length > maxCvcLength) {
            cvcValue = cvcValue.slice(0, maxCvcLength);
        }
        setCvc(cvcValue);
    };


    const handlePaymentSubmission = () => {
        window.Worldpay.submitTemplateForm(); // This triggers the tokenization process
    };
    useEffect(() => {
        scrollToTop();
        if (window.Worldpay && isWorldpaySdkLoaded && formRef.current) {
            console.log(window.Worldpay)
            Worldpay.checkout.init(
                {
                    id: "your-checkout-id",
                    form: "#card-form",
                    fields: {
                        pan: {
                            selector: "#card-pan",
                            placeholder: "4444333322221111"
                        },
                        cvv: {
                            selector: "#card-cvv",
                            placeholder: "123"
                        },
                        expiry: {
                            selector: "#card-expiry",
                            placeholder: "MM/YY"
                        }
                    },
                    //styles: {
                    //    "input": {
                    //        "color": "black",
                    //        "font-weight": "bold",
                    //        "font-size": "20px",
                    //        "letter-spacing": "3px"
                    //    },
                    //    "input#pan": {
                    //        "font-size": "24px"
                    //    },
                    //    "input.is-valid": {
                    //        "color": "green"
                    //    },
                    //    "input.is-invalid": {
                    //        "color": "red"
                    //    },
                    //    "input.is-onfocus": {
                    //        "color": "black"
                    //    }
                    //},
                    accessibility: {
                        ariaLabel: {
                            pan: "my custom aria label for pan input",
                            expiry: "my custom aria label for expiry input",
                            cvv: "my custom aria label for cvv input"
                        },
                        lang: {
                            locale: "en-GB"
                        },
                        title: {
                            enabled: true,
                            pan: "my custom title for pan",
                            expiry: "my custom title for expiry date",
                            cvv: "my custom title for security code"
                        }
                    },
                    acceptedCardBrands: ["amex", "diners", "discover", "jcb", "maestro", "mastercard", "visa"]
                },
                function (error, checkout) {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    // Attach event listeners to form and clear button
                    formRef.current.addEventListener('submit', function (event) {
                        event.preventDefault();
                        checkout.generateSessionState(function (error, sessionState) {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            // Handle sessionState here
                            alert(sessionState);
                        });
                    });

                    if (clearRef.current) {
                        clearRef.current.addEventListener('click', function (event) {
                            event.preventDefault();
                            checkout.clearForm(function () {
                                console.log('Form successfully cleared');
                            });
                        });
                    }
                });
        }
    }, [isWorldpaySdkLoaded, worldpayMerchantId]);



    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };
    return (
        <div className='checkout-paymentForm-container'>
            <ShippingDetailsComponent
                shippingDetails={shippingDetails}
                back={back}
            />
            <Typography mt={8} sx={{ mb: { xs: 2, sm: 0 } }} variant='h6'>
                Payment:
            </Typography>
            <Typography variant="body2" fontWeight={100} className='checkout-paymentForm-SQUARE'>
                <span className='square-text'> All transactions are secured and encrypted by</span> <img src="https://i.imgur.com/DsnzIP1.png" alt="worldpay-logo" className='checkout-paymentForm-logo' height={50} width={90} />
            </Typography>
            <Typography variant='body2' fontWeight={100} className='worldpay-form-text'>Worldpay© Payment Form</Typography>
            <div className='checkout-payment-card-form'>
                <Typography color='error' variant="body2" fontWeight={100} className='checkout-paymentForm-SQUARE'>
                    {errors}
                </Typography>
                {/* Worldpay Card Input Form */}
                <div className='card-super-container'>
                    <section id="worldpay-card-element" className="card-container">
                        <div className="card">
                            <div className="chip-brand">
                                <Icon name='chip' className='chip-svg' />
                                <div className="card-brand-icon">
                                    {cardType === 'visa' && <Icon className='card-icon-svg' name='visa' />}
                                    {cardType === 'mastercard' && <Icon className='card-icon-svg' name="mastercard" />}
                                    {cardType === 'amex' && <Icon className='card-icon-svg' name="amex" />}
                                    {cardType === 'discover' && <Icon className='card-icon-svg' name="discover" />}
                                    {cardType === 'diners' && <Icon className='card-icon-svg' name="diners" />}
                                    {cardType === 'jcb' && <Icon className='card-icon-svg' name="jcb" />}

                                    {/* Add more icons as needed */}
                                </div>

                            </div>
                            <form action="#">
                                <label htmlFor="number">Card Number
                                    <input
                                        type="text"
                                        id="number"
                                        placeholder="0000 - 0000 - 0000 - 0000"
                                        value={cardDisplayNumber}
                                        onChange={handleCardNumberChange}
                                    />

                                </label>
                                <label htmlFor="name">Name
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="John Doe"
                                    />
                                </label>
                                <label htmlFor="date">Exp Date
                                    <input
                                        type="text"
                                        id="date"
                                        value={expiryDate}
                                        onChange={handleExpiryDateChange}
                                        placeholder="MM/YY"
                                    />
                                </label>
                                <label htmlFor="cvc">cvc
                                    <input
                                        type="text"
                                        id="cvc"
                                        placeholder="CVC"
                                        value={cvc}
                                        onChange={handleCvcChange}
                                    />                                </label>
                                <Button>BUY NOW
                                    <i className="fa fa-angle-right"></i>
                                </Button>
                                <label htmlFor="remember">Save my information for later
                                    <input readOnly type="checkbox" checked="checked" id="remember" />
                                </label>
                            </form>
                        </div>
                        <Typography color={'primary'}>Will be Charged: ${total.grandTotal.toFixed(2)}</Typography>

                    </section>

                </div>

            </div>
            <Button onClick={back} variant="outlined" sx={{ mt: 3, width: '100%', letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 50, '&:hover': { backgroundColor: '#0F75E0', color: 'white', } }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 18, mr: 1 }} />
                Return to Shipping
            </Button>
        </div>
    );
};

export default WorldpayPaymentForm;
