import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../Styles/NavBar.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
    const [scrolling, setScrolling] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = 'https://www.google.com/maps/dir/47.6766053,-122.1973696/5+Lake+St,+Kirkland,+WA+98033/@47.6761429,-122.2433748,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x549012e7751ffa81:0x18d225f444649442!2m2!1d-122.2069796!2d47.6757101?entry=ttu'
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 740);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const navbarClasses = ['navbar', scrolling ? 'navbar-black' : ''].join(' ');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="navbar-container">
            <nav className={navbarClasses}>
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <Link to="/">
                            <img src={logo} alt="Eastlake Auto Brokers" className='logo-image' />
                        </Link>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="navbar-box-top">
                        <div className="navbar-top">
                            <div className="navbar-address">

                                {isMobile ? (
                                    <div className="navigation-logo">
                                        <a href="/contact">
                                            <LocationOnIcon
                                                className='navigation-logo'
                                                style={{ fontSize: '50px', marginRight: '-20px' }}
                                            />
                                        </a>
                                        <br /> <div className='navigation' ><a href={location} style={{ fontSize: '12px' }}> Directions</a></div>
                                    </div>
                                ) : (
                                    <a href={location}>
                                        <LocationOnIcon className='navigation-logo1'
                                            style={{ fontSize: '30px', marginRight: '10px' }} />
                                        LOCATION
                                    </a>
                                )}

                            </div>
                            <div className="navbar-phone">



                                {isMobile ? (
                                    <div className="phone-logo">
                                        <a href="tel:+4258231500">
                                            <PhoneIcon
                                                className='phone-logo'
                                                style={{ fontSize: '50px', marginRight: '10px' }}
                                            />
                                        </a>
                                        <br /> <div className='phone' ><a href="tel:+4258231500" style={{ fontSize: '12px' }}>Call Us</a></div>
                                    </div>
                                ) : (
                                    <a href="tel:+4258231500">
                                        <PhoneIcon className='phone-logo1'
                                            style={{ fontSize: '30px', marginRight: '10px' }}
                                        />
                                        425-823-1500
                                    </a>
                                )}

                            </div>
                            <div className="navbar-user">
                                {isMobile ? (

                                    <div className="">
                                        <a href="/cart" >
                                            <AccountCircleIcon
                                                className="shop-logo"
                                                style={{ fontSize: '50px', marginRight: '10px' }}
                                            />
                                        </a>
                                        <br /> <div className='account' ><a href="/cart" style={{ fontSize: '12px' }}>Account</a></div>
                                    </div>
                                ) : (
                                    <a href="/cart"   >
                                        <AccountCircleIcon
                                            className="shop-logo1"
                                            style={{ fontSize: '30px', marginRight: '10px' }}
                                        />
                                        ACCOUNT
                                    </a>
                                )}
                            </div>

                            <div to="/cart" className="navbar-cart">
                                {isMobile ? (

                                    <div className="|">
                                        <a href='/shop'  >
                                            <ShoppingCartIcon
                                                className="shop-logo"
                                                style={{ fontSize: '50px', marginRight: '10px' }}
                                            />
                                        </a><br /> <div className='cart' ><a href="/cart" style={{ fontSize: '12px' }}>Cart</a></div>
                                    </div>
                                ) : (
                                    <a href="/cart">
                                        <ShoppingCartIcon
                                            className="shop-logo1"
                                            style={{ fontSize: '30px', marginRight: '10px' }}
                                        />
                                        CART
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    {isMobile ? (
                        <div className="mobile-menu-icon" onClick={toggleMenu}>
                            <div className={`menu-bars ${menuOpen ? 'open' : ''}`}>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                            {menuOpen && (
                                <div className="mobile-overlay">
                                    <div className="mobile-dropdown">
                                        <ul className='navbar-bottom' >
                                            <li className='navbar-bottom-mobile' ><Link to="/inventory">Inventory</Link></li>
                                            <li className='navbar-bottom-mobile' ><Link to="/finance">Finance</Link></li>
                                            <li className='navbar-bottom-mobile' ><Link to="/contact">Contact</Link></li>
                                            <li className='navbar-bottom-mobile' ><Link to="/about">About Us</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="navbar-box-bottom">
                            <div className="navbar-bottom">
                                <ul>
                                    <li><Link to="/shop">SHOP</Link></li>
                                    <li><Link to="/finance">CBD</Link></li>
                                    <li><Link to="/contact">CBA</Link></li>
                                    <li><Link to="/about">About Us</Link></li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
            </nav >
        </div >
    );
};

export default Navbar;