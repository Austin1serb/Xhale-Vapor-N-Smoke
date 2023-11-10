import React, { useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { BiSearchAlt } from 'react-icons/bi';
const AddressAutocomplete = ({ id, label, fullWidth, variant, onAddressSelected, value, setValue }) => {
    const autocompleteInput = useRef(null);
    useEffect(() => {
        // Function to initialize the Autocomplete
        const initAutocomplete = () => {
            const autocomplete = new window.google.maps.places.Autocomplete(
                autocompleteInput.current,
                { types: ['address'] }
            );

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                onAddressSelected(place); // Pass the place object to the parent component
            });
        };

        // Check if the Maps API has loaded before initializing Autocomplete
        if (window.isGoogleMapsLoaded) {
            initAutocomplete();
        } else {
            // If not loaded, define a listener for when it does load
            window.initMap = initAutocomplete;
        }
    }, [onAddressSelected]);

    return (
        <TextField
            inputRef={autocompleteInput}
            id={id}
            label={label}
            fullWidth={fullWidth}
            InputProps={{
                endAdornment: <InputAdornment position="end" >
                    <BiSearchAlt fontSize={24} />
                </InputAdornment>,
            }}
            variant={variant}
            value={value}
            onChange={e => setValue(e.target.value)} // Lift up the change to the parent component
            placeholder="Enter address"
        />
    );
};


export default AddressAutocomplete;