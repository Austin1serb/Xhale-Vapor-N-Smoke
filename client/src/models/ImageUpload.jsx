// ImageUpload.js

import React from 'react';
import {
    FormControl, FormLabel, Box, Button,
    Typography, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
const ImageUpload = ({
    error,
    loading,
    selectedImage,
    selectedImageData,
    handleImage,
    setSelectedImageData
}) => {

    const handleRemoveImage = (indexToRemove) => {
        const newImages = selectedImageData.filter((_, index) => index !== indexToRemove);
        setSelectedImageData(newImages);
    };


    const imageContainerStyles = {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '5px'
    };

    // Styles for the image thumbnail container
    const thumbnailContainerStyles = {
        display: 'flex',
        overflowX: 'auto', // Adds horizontal scroll if content exceeds container width
        gap: '10px', // Spacing between image containers
    };
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });


    return (
        <FormControl
            sx={{
                width: '97%',
                fontSize: 8,
                my: 2,
                pl: 1,
                py: 1,
                pr: 1,
                border: 1,
                borderRadius: 1,
                // Apply MUI error color to border when there is an error
                borderColor: error['imgSource'] ? theme => theme.palette.error.main : 'black',
                '&:hover': {
                    borderColor: error['imgSource'] ? theme => theme.palette.error.main : '#1776D1',
                    '& .MuiFormLabel-root': {
                        // Apply MUI error color to title when there is an error
                        color: error['imgSource'] ? theme => theme.palette.error.main : '#1776D1',

                        transition: 'color 0.4s, ',
                    },
                },
                ' &:not(:hover)': {
                    '& .MuiFormLabel-root': {
                        // Apply MUI error color to title when there is an error
                        color: error['imgSource'] ? theme => theme.palette.error.main : 'initial',

                        transition: 'color 0.4s, ',
                    },
                },
            }}
            component="fieldset"
        >
            <FormLabel component="legend"
                sx={{
                    fontSize: 16,
                    pr: 0.5,
                    pl: .5,
                    // Apply MUI error color to title when there is an error
                    color: error['imgSource'] ? theme => theme.palette.error.main : 'initial',
                }}
            > Upload an image*</FormLabel>
            <Box>
                <Button accept="image/*"

                    id="image-upload"
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}

                    // Apply MUI error color to button when there is an error
                    sx={{
                        my: 1
                    }}
                    color={error['imgSource'] ? 'error' : 'primary'}
                    disabled={loading || (selectedImageData && selectedImageData.length >= 5)} // Disable button if 5 or more images are uploaded
                >
                    {loading ? ( // Display CircularProgress while loading
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Add image'
                    )}
                    <VisuallyHiddenInput accept="image/*"
                        id="image-upload" type="file" multiple onChange={handleImage}
                    />
                </Button>
                {/* Displaying max limit message */}
                {(selectedImageData && selectedImageData.length >= 5) &&
                    <Typography variant='caption' sx={{ ml: 1.2 }} color="textSecondary">
                        Max 5 photos
                    </Typography>
                }
                {selectedImage ? (
                    <Typography variant="body2" color="textSecondary">
                        Selected image(s): {selectedImage.name}
                    </Typography>
                ) : (
                    <Box>
                        <Typography variant="body2" color="textSecondary">Uploaded Image(s)</Typography>
                    </Box>
                )}

                {error['imgSource'] && (
                    <Typography variant='caption' sx={{ ml: 1.2 }} color="error">
                        {error['imgSource']}
                    </Typography>
                )}
                <Box sx={thumbnailContainerStyles}>
                    {selectedImageData && selectedImageData.length > 0 ? (
                        selectedImageData.map((imgUrl, index) => (
                            <div key={index} style={imageContainerStyles}>
                                <img
                                    src={imgUrl}
                                    alt={`Selected Thumbnail ${index + 1}`}
                                    style={{ maxWidth: '100px', maxHeight: '100px', minWidth: '100px', minHeight: '100px', border: '.5px solid black', }}
                                    loading='lazy'
                                />
                                <Button
                                    size="small"
                                    variant="text"

                                    onClick={() => handleRemoveImage(index)}
                                    sx={{ marginTop: '5px' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))
                    ) : (
                        <Typography sx={{ m: 1 }} variant='caption' color="textSecondary">
                            Preview will appear here after selecting an image.
                        </Typography>
                    )}
                </Box>


            </Box>
        </FormControl>

    );
}

export default ImageUpload;
