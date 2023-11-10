import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, InputAdornment, FormControl } from '@mui/material';
import { RiInformationLine } from 'react-icons/ri';

import AddressAutocomplete from './AddressAutocomplete';

const InformationComponent = ({ next, onShippingDetailsSubmit }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Construct the details object from the state
        const details = {
            email,
            firstName,
            lastName,
            address,
            address2,
            city,
            state,
            zip,
            country
        };
        onShippingDetailsSubmit(details);
        console.log(details)
        next(); // If this is meant to trigger the next step in the process
    };


    const handleAddressChange = (place) => {
        let streetNumber = '';
        let route = '';
        setAddress('');
        setAddress2('');
        setCity('');
        setState('');
        setZip('');
        setCountry('');

        place.address_components.forEach(component => {
            const componentType = component.types[0];
            if (componentType === 'street_number') {
                streetNumber = component.long_name;
            } else if (componentType === 'route') {
                route = component.long_name;
            }
            switch (componentType) {
                case "street_number":
                    streetNumber = component.long_name;
                    break;
                case "route":
                    route = component.long_name;
                    break;
                case "locality":
                    setCity(component.long_name);
                    break;
                case "administrative_area_level_1":
                    setState(component.short_name);
                    break;
                case "postal_code":
                    setZip(component.long_name);
                    break;
                case "country":
                    setCountry(component.long_name);
                    break;
                default:
                    // Unknown component type
                    break;
            }
            // Combine street number and route
            const streetAddress = [streetNumber, route].filter(Boolean).join(' ');
            setAddress(streetAddress); // Set only the street address for the "Address line 1" field

        });

        // Combine street number and route to form the street address
        const streetAddress = streetNumber && route ? `${streetNumber} ${route}` : route;
        setAddress(streetAddress); // Set only the street address for the "Address line 1" field
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <Typography variant="h6" gutterBottom>
                    Contact
                </Typography>
                <TextField

                    required
                    id="email"
                    name="email"
                    label="Email"

                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    variant="outlined"
                >
                    Email</TextField>
                <Typography variant="h6" gutterBottom>
                    Shipping Information
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="firstName"
                            name="firstName"
                            label="First name"
                            fullWidth
                            onChange={e => setFirstName(e.target.value)}
                            autoComplete="given-name"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="lastName"
                            name="lastName"
                            label="Last name"
                            fullWidth
                            onChange={e => setLastName(e.target.value)}
                            autoComplete="family-name"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <AddressAutocomplete

                            id="address1"
                            label="Address line 1"
                            fullWidth

                            onAddressSelected={handleAddressChange}
                            value={address}
                            setValue={setAddress}
                        />
                    </Grid>
                    <Grid item xs={12}>

                        <TextField
                            helperText={<span>
                                <RiInformationLine fontSize={16} style={{ transform: 'translateY(3px)' }} />
                                {' Add a Building /Appartment number if you have one'}
                            </span>}
                            id="address2"
                            name="address2"
                            label="Address line 2"
                            fullWidth
                            autoComplete="shipping address-line2"
                            variant="outlined"
                            onChange={e => setAddress2(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>

                        <TextField
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required
                            id="city"
                            name="city"
                            label="City"
                            fullWidth
                            autoComplete="shipping address-level2"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            value={state}
                            onChange={e => setState(e.target.value)}
                            required
                            id="state"
                            name="state"
                            label="state"
                            fullWidth
                            autoComplete="administrative_area_level_1"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            value={zip}
                            onChange={e => setZip(e.target.value)}
                            required
                            id="zip"
                            name="zip"
                            label="zip"
                            fullWidth
                            autoComplete="postal_code"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            required
                            id="country"
                            name="country"
                            label="country"
                            fullWidth
                            autoComplete="country"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Continue to shipping
                        </Button>
                    </Grid>
                </Grid>
            </FormControl>
        </form>
    );
};

export default InformationComponent;
