import React, { useEffect, useRef, useState } from 'react';
import '../Styles/AboutUs.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import brandIcon from '../assets/brandIconSmall.webp'
import { Link, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../utils/secrets';
const QuickView = React.lazy(() => import('../components/QuickView'));

const AboutUs = () => {
    useEffect(() => {
        document.title = "About Herba Natural - Learn More About Our CBD Journey.";
        document.querySelector('meta[name="description"]').setAttribute("content", "Learn about Herba Natural's mission, our high-quality CBD products, and our journey in the CBD industry..");
    }, []);


    const [bestSellers, setBestSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const location = useLocation();
    const bottomElementRef = useRef(null);

    useEffect(() => {

        if (location.state?.scrollToBottom && bottomElementRef.current) {
            bottomElementRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.state, location.state?.scrollToBottom]);




    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = () => {
        setIsLoading(true);
        fetch(`${BACKEND_URL}/api/product/bestsellers?limit=3`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setBestSellers(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching best sellers:', error);
                setIsLoading(false);
            });
    }

    const nextProduct = () => {
        setCurrentProductIndex((prevIndex) =>
            (prevIndex + 1) % bestSellers.length
        );
    };

    const previousProduct = () => {
        setCurrentProductIndex((prevIndex) =>
            (prevIndex - 1 + bestSellers.length) % bestSellers.length
        );
    };



    const faqs = [
        {
            question: "What is CBD?",
            answer: "CBD is a naturally occurring compound found in the hemp plant, known for its potential therapeutic properties without the psychoactive effects often associated with cannabis."
        },
        {
            question: "How do I choose the right CBD product?",
            answer: "Choosing the right CBD product depends on your wellness goals, preferred method of consumption, and any specific dietary or allergic needs you may have. Our team can help guide you to the best choice for your individual needs."
        },
        {
            question: "Is CBD legal?",
            answer: "CBD products derived from hemp containing less than 0.3% THC are legal at the federal level in the United States, but still illegal under some state laws. Check your local legislation for more information."
        },
        {
            question: "Can CBD products make me 'high'?",
            answer: "No, CBD is a non-psychoactive compound, which means it does not produce the 'high' associated with THC, a different compound found in the cannabis plant."
        },
        {
            question: "Are there any side effects of using CBD?",
            answer: "CBD is generally well-tolerated and considered safe, but some people may experience mild side effects like fatigue, changes in appetite, or gastrointestinal issues. Consult with a healthcare provider before starting any new supplement."
        },
        {
            question: "How should I store my CBD products?",
            answer: "CBD products should be stored in a cool, dry place away from direct sunlight to preserve their quality and potency."
        },
        {
            question: "Can I use CBD products while taking other medications?",
            answer: "CBD can interact with certain medications, so it's important to consult with a healthcare professional before starting to use CBD products if you are on medication."
        },
        {
            question: "How long does it take for CBD to work?",
            answer: "The onset time for CBD effects can vary depending on the method of consumption. Oils and tinctures may work within 30 minutes, while edibles can take up to two hours."
        },
        {
            question: "What is the difference between full-spectrum, broad-spectrum, and isolate CBD products?",
            answer: "Full-spectrum CBD contains all compounds found in the hemp plant, including trace amounts of THC. Broad-spectrum has most hemp compounds but no THC, while isolate is pure CBD with no other cannabinoids."
        },
        {
            question: "Do you provide lab reports for your products?",
            answer: "Yes, we believe in transparency and provide third-party lab reports for all of our products, ensuring their quality, potency, and safety."
        }
    ];






    const buttonStyle = {
        fontSize: '10px',
        padding: '15px',

        height: '26px'
    }
    return (
        <div className="about-container">
            <div style={{ height: '100%', width: '100%' }}>
                <img src={brandIcon} alt="brand icon" height='100%' width='100%' />
            </div>

            <h1>About Us at Herba Natural</h1>
            <p className="slogan">"Harmony in Every Leaf, Relish Herbs for Holistic Living"</p>

            <section className="introduction">
                <p>Welcome to Herba Natural, a sanctuary where the purity of nature meets the art of holistic wellness. Our journey began with a simple, yet profound belief: nature holds the key to harmony and well-being.  Inspired by the therapeutic virtues of CBD, we embarked on a mission to bring its natural benefits to your doorstep.</p>
            </section>

            <section className="philosophy">
                <h2>Our Philosophy</h2>
                <p>        At Herba Natural, we are driven by a passion for purity and quality. We believe that true wellness emerges from products that are as close to their natural state as possible. This philosophy guides our selection of CBD products, ensuring that every item we offer is sourced from the finest, most responsible producers.</p>
            </section>

            <section className="products">
                <h2>Our Products</h2>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <div className="product-gallery">
                        <div className="product-display">
                            <div className='about-product-item'>
                                <img style={{ backgroundColor: 'white' }} src={bestSellers[currentProductIndex]?.imgSource[0].url}

                                    alt={bestSellers[currentProductIndex]?.name} />
                                {/* ADD A BUTTON THAT OPENS THE QUICKVIEW OF THAT PRODUCT */}

                                <Button variant='outlined' sx={buttonStyle} className='dropdown-featured-button' onClick={() => {
                                    setQuickViewProduct(bestSellers[currentProductIndex]._id);
                                    setQuickViewOpen(true);
                                }}>Quick View</Button>
                            </div>
                            <Box display={{ xs: 'none', sm: 'flex' }}>
                                {bestSellers[currentProductIndex + 1] ? (<div className='about-product-item'>
                                    <img style={{ backgroundColor: 'white' }} src={bestSellers[currentProductIndex + 1]?.imgSource[0].url}
                                        alt={bestSellers[currentProductIndex + 1]?.name} />
                                    <Button variant='outlined' sx={buttonStyle} className='dropdown-featured-button' onClick={() => {
                                        setQuickViewProduct(bestSellers[currentProductIndex + 1]?._id);
                                        setQuickViewOpen(true);
                                    }}>Quick View</Button>
                                </div>) : (null)}
                                {bestSellers[currentProductIndex + 2] ? (<div className='about-product-item'>
                                    <div className='about-product-item'>
                                        <img style={{ backgroundColor: 'white' }} src={bestSellers[currentProductIndex + 2]?.imgSource[0].url}
                                            alt={bestSellers[currentProductIndex + 2]?.name} />
                                        <Button variant='outlined' sx={buttonStyle} className='dropdown-featured-button' onClick={() => {
                                            setQuickViewProduct(bestSellers[currentProductIndex + 2]?._id);
                                            setQuickViewOpen(true);
                                        }}>Quick View</Button>

                                    </div>

                                </div>) : (null)}
                            </Box>
                        </div>
                        <div className="gallery-controls">
                            <button onClick={previousProduct}>&lt;</button>
                            <span>CONTROLLS</span>
                            <button onClick={nextProduct}>&gt;</button>
                        </div>
                    </div>
                )}
                <p>     Our shelves boast a curated collection of CBD products from three premium brands, each selected for their commitment to quality and purity. From soothing oils and balms to rejuvenating creams and edibles, every product is a testament to our dedication to your holistic well-being. As we grow, we aim to expand our range, continuously exploring new, innovative brands that align with our ethos.</p>
            </section>


            <section className="promise">
                <h2>Our Promise</h2>
                <p>   At Herba Natural, we understand that every individual's journey to wellness is unique. Our promise to you is one of unwavering commitment to excellence and education. We strive to be not just a provider of CBD products, but a trusted advisor and friend on your path to holistic living. Our knowledgeable team is always ready to guide you through our selections, ensuring you find the perfect product to harmonize your body, mind, and spirit.</p>
            </section>

            <section className="join-us">
                <h2>Join Us</h2>
                <p>         We invite you to experience the tranquil essence of Herba Natural. Discover the harmony in every leaf, and embrace the world of holistic well-being that awaits you.   <Link to="/registration"  >Join Us Now</Link></p>

            </section>


            <section className="faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-accordion">
                    {faqs.map((faq, index) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}a-content`}
                                id={`panel${index}a-header`}
                            >
                                {faq.question}
                            </AccordionSummary>
                            <AccordionDetails>
                                {faq.answer}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
                <div ref={bottomElementRef}></div>
            </section>

            <QuickView
                productId={quickViewProduct}
                open={quickViewOpen}
                handleClose={() => setQuickViewOpen(false)}
                products={bestSellers}
            />

        </div>
    );
}

export default AboutUs;