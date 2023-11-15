import React, { useEffect, useRef } from 'react';
import { TextField, InputAdornment, Tooltip, IconButton } from '@mui/material';
import { BiSearchAlt } from 'react-icons/bi';
const AddressAutocomplete = ({ id, label, fullWidth, variant, onAddressSelected, value, setValue, error, helperText, color, focused, onBlur, sx }) => {
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