import React, { useEffect, useRef, useState } from 'react';
import { TextField, InputAdornment, Tooltip, IconButton, CircularProgress } from '@mui/material';

const AddressAutocomplete = ({ id, label, fullWidth, variant, onAddressSelected, value, setValue, error, helperText, color, focused, onBlur, sx }) => {
    const autocompleteInput = useRef(null);
    const [isApiLoaded, setIsApiLoaded] = useState(!!window.google);
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
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

            setIsApiLoaded(true);
        };
        window.initAutocomplete = initAutocomplete
        // Function to load the Google Maps API script
        const loadScript = () => {
            if (!document.querySelector('script[src*="googleapis"]')) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initAutocomplete`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        };


        // Load script if Google Maps API is not already loaded
        if (!window.google) {
            loadScript();
        } else {
            initAutocomplete();
        }
        return () => {
            // Remove the script tag
            const script = document.getElementById('google-maps-script');
            if (script) {
                document.head.removeChild(script);
            }

            // Clean up the global function if it was added
            if (window.initAutocomplete) {
                delete window.initAutocomplete;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onAddressSelected]);

    return (
        <TextField
            inputRef={autocompleteInput}
            id={id}
            label={label}
            fullWidth={fullWidth}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">

                        {isApiLoaded ? <Tooltip title="Google Places will help you validate your address">
                            <IconButton sx={{ mr: -1 }}>
                                {/* magnify icon */}
                                <svg height='20' fill='#0f75e0' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" /></svg>
                            </IconButton>
                        </Tooltip> : <CircularProgress size={20} thickness={4} color="primary" />}
                    </InputAdornment>
                ),
            }}
            variant={variant}
            value={value}
            onChange={e => setValue(e.target.value)}
            helperText={helperText}
            error={error}
            color={color}
            focused={focused}
            onBlur={onBlur}
            autoComplete='address'
            sx={sx}
        />

    );
};


export default AddressAutocomplete;