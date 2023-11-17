import React, { useEffect, useRef, useState } from 'react';
import { TextField, InputAdornment, Tooltip, IconButton } from '@mui/material';
import { BiSearchAlt } from 'react-icons/bi';

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

        // Function to load the Google Maps API script
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initAutocomplete;
            document.head.appendChild(script);
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
    }, [onAddressSelected]);

    return (
        <TextField
            inputRef={autocompleteInput}
            id={id}
            label={label}
            fullWidth={fullWidth}
            InputProps={{
                endAdornment:
                    <InputAdornment position="end" >
                        <Tooltip title="Google Places will help you validate your address">
                            <IconButton sx={{ mr: -1, color: '#0F75E0' }}>
                                <BiSearchAlt fontSize={24} />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>,
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