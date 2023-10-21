





import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
    Box,
    Typography,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper, // Import MenuItem for category selection
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryInput from '../components/CategoryInput';
import SeoKeywordsInput from '../components/SeoKeywordsInput';
import { styled } from '@mui/material/styles';

const initialProductData = {
    brand: '',
    name: '',
    price: '',
    imgSource: '',
    category: [],
    description: '',
    strength: 'low',
    isFeatured: false,
    seo: {
        title: '',
        description: '',
    },
    seoKeywords: [],
    shipping: {
        weight: 0,
        dimensions: {
            length: 0,
            width: 0,
            height: 0,
        },
    },
};



const AddProductModal = ({ open, onClose, onAddProduct, selectedProduct, onUpdateProduct, }) => {
    const [productData, setProductData] = useState(selectedProduct || initialProductData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageData, setSelectedImageData] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState('low');
    const [isNewImageSelected, setIsNewImageSelected] = useState(false);

    const handleStrengthChange = (event) => {
        const newStrength = event.target.value;
        setSelectedStrength(newStrength);
        setProductData({ ...productData, strength: newStrength });
    };


    const handleAddKeyword = (newKeyword) => {
        setProductData({
            ...productData,
            seoKeywords: [...productData.seoKeywords, newKeyword],
        });
    };

    const handleRemoveKeyword = (keyword) => {
        const updatedKeywords = productData.seoKeywords.filter((kw) => kw !== keyword);
        setProductData({
            ...productData,
            seoKeywords: updatedKeywords,
        });
    };

    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct);
            setSelectedStrength(selectedProduct.strength);
            // Check if selectedProduct has an image source
            if (selectedProduct.imgSource && selectedProduct.imgSource.url) {
                fetch(selectedProduct.imgSource.url)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        setSelectedImageData(url);
                    })
                    .catch((error) => {
                        console.error('Error fetching image:', error);
                    });
            } else {
                // Clear the selectedImageData when there is no image
                setSelectedImageData(null);
            }
            // Handle other states as needed
        } else {
            setProductData(initialProductData);
            setSelectedImageData(null);
            // Handle other states as needed for a new product
        }
    }, [selectedProduct]);





    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('seo.')) {
            const seoField = name.replace('seo.', ''); // Remove "seo." from the field name
            setProductData({
                ...productData,
                seo: {
                    ...productData.seo,
                    [seoField]: value,
                },
            });
        }
        else if (name.startsWith('shipping.')) {
            // Check if it's shipping.weight or shipping.dimensions properties
            if (name === 'shipping.weight') {
                setProductData({
                    ...productData,
                    shipping: {
                        ...productData.shipping,
                        weight: value,
                    },
                });
            } else if (name.startsWith('shipping.dimensions.')) {
                const dimensionProp = name.replace('shipping.dimensions.', '');
                setProductData({
                    ...productData,
                    shipping: {
                        ...productData.shipping,
                        dimensions: {
                            ...productData.shipping.dimensions,
                            [dimensionProp]: value,
                        },
                    },
                });
            }
        } else if (name === 'category') {
            const formattedCategory = value.toLowerCase().replace(/\s/g, '');
            setProductData({ ...productData, [name]: formattedCategory });
        } else if (name === 'isFeatured') {
            // Convert the value to a boolean
            const isFeatured = value === 'true';
            setProductData({ ...productData, [name]: isFeatured });

        } else {
            setProductData({ ...productData, [name]: value });
        }
    };



    if (productData) console.log(productData)


    const handleAddProduct = async () => {
        try {
            setLoading(true);
            const strength = selectedStrength; // Store the selected strength
            productData.strength = strength;

            if (selectedProduct) {
                let productToUpdate = { ...productData };

                // Check if a new image has been selected
                if (selectedImage) {
                    productToUpdate.imgSource = {
                        url: selectedImageData,
                        publicId: selectedProduct.imgSource.publicId,
                    };
                } else {
                    // If no new image is selected, keep the existing image data
                    productToUpdate.imgSource = selectedProduct.imgSource;
                }
                console.log("******" + selectedImage)
                console.log("isFeatured value: ", productData.isFeatured);

                // Editing an existing product
                const response = await fetch(`http://localhost:8000/api/product/${selectedProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productToUpdate),
                });


                if (response.ok) {
                    const updatedProduct = await response.json();
                    onUpdateProduct(updatedProduct);
                    setError(false); // Reset the error state
                    setSelectedImage(null);
                    setSelectedImageData(null);
                    onClose();


                } else {
                    // Update failed, handle error response
                    const errorData = await response.json();
                    if (errorData.errors) {
                        setError(errorData.errors);
                    } else {
                        console.error('Update error:', errorData.message);
                        // Handle other error cases as needed
                    }
                }
            } else {
                // Creating a new product
                productData.imgSource = selectedImageData;

                const response = await fetch('http://localhost:8000/api/product/', {
                    method: 'POST', // Use POST to create a new product
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });

                if (response.ok) {
                    const newProduct = await response.json();
                    onAddProduct(newProduct);

                    setProductData(initialProductData);
                    setSelectedStrength('low'); // Reset selectedStrength
                    setError(false); // Reset the error state
                    setSelectedImage(null);
                    setSelectedImageData(null);
                    onClose();
                } else {
                    // Registration or update failed, handle error response
                    const errorData = await response.json();
                    if (errorData.errors) {
                        setError(errorData.errors);
                    } else {
                        console.error('Registration error:', errorData.message);
                        // Handle other error cases as needed
                    }
                }
            }
        } catch (error) {
            console.error('Error adding/updating product:', error);
        } finally {
            setLoading(false);
        }
    };


    // receive file from form
    const handleImage = (e) => {
        const file = e.target.files[0];
        // convert image file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setProductData({ ...productData, "imgSource": reader.result })
            setSelectedImage(file);
            setSelectedImageData(reader.result); // Set the selected image data for the thumbnail
            setIsNewImageSelected(true); // Set the flag to indicate a new image is selected
        };

    };


    const clearForm = () => {
        setProductData(initialProductData);
        setError(false);
        setSelectedImage(null);
        setSelectedImageData(null);
        setSelectedStrength('low');
    };


    // Function to handle adding a new category
    const handleAddCategory = (newCategory) => {
        setProductData({
            ...productData,
            category: [...productData.category, newCategory],
        });
    };

    // Function to handle removing a category
    const handleRemoveCategory = (category) => {
        setProductData({
            ...productData,
            category: productData.category.filter((c) => c !== category),
        });
    };
    const { shipping } = productData;
    const weight = shipping?.weight || ''; // Provide a default value for weight if shipping or weight is undefined
    const dimensions = shipping?.dimensions || {};
    const length = dimensions.length || '';
    const width = dimensions.width || '';
    const height = dimensions.height || '';

    const paperProps = {
        style: {
            borderRadius: '5px', // Set the border radius to 10px
        },
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
        <Dialog open={open} onClose={onClose} PaperProps={paperProps}>

            <DialogTitle
                sx={{ backgroundColor: '#282F48', color: 'white', borderRadius: "5px 5px 0px 0" }}
            >{selectedProduct ? 'Edit Product Details' : 'Add New Product'}</DialogTitle>

            <DialogContent>

                <DialogContentText sx={{ my: 2 }} >
                    Please fill in the details of the new product.
                </DialogContentText>

                <DialogContentText variant='caption' sx={{ m: 2, color: '#D23030' }}>
                    Fields with * are required.
                </DialogContentText>

                {loading && <CircularProgress />}

                {/* Brand */}
                <TextField
                    sx={{ my: 2, }}
                    name="brand"
                    label="Brand*"
                    fullWidth
                    error={Boolean(error.brand)}
                    helperText={error.brand}
                    value={productData.brand}
                    onChange={handleChange}
                />

                {/* Name */}
                <TextField
                    sx={{ my: 2 }}
                    name="name"
                    label="Name*"
                    fullWidth
                    error={Boolean(error.name)}
                    helperText={error.name}
                    value={productData.name}
                    onChange={handleChange}
                />

                {/* Price */}
                <TextField
                    sx={{ my: 2 }}
                    name="price"
                    label="Price*"
                    type="number"
                    fullWidth
                    error={Boolean(error.price)}
                    helperText={error.price}
                    value={productData.price}
                    onChange={handleChange}
                />

                {/* Description */}
                <TextField
                    sx={{ my: 2 }}
                    name="description"
                    label="Description*"
                    multiline
                    rows={4}
                    fullWidth
                    error={Boolean(error.description)}
                    helperText={error.description}
                    value={productData.description}
                    onChange={handleChange}
                />

                {/* Image Upload */}
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
                        borderColor: error['imgSource.url'] ? theme => theme.palette.error.main : 'black',
                        '&:hover': {
                            borderColor: error['imgSource.url'] ? theme => theme.palette.error.main : '#1776D1',
                            '& .MuiFormLabel-root': {
                                // Apply MUI error color to title when there is an error
                                color: error['imgSource.url'] ? theme => theme.palette.error.main : '#1776D1',
                                fontSize: '14px',
                                transition: 'color 0.4s, font-size 0.4s',
                            },
                        },
                        ' &:not(:hover)': {
                            '& .MuiFormLabel-root': {
                                // Apply MUI error color to title when there is an error
                                color: error['imgSource.url'] ? theme => theme.palette.error.main : 'initial',
                                fontSize: 'inital',
                                transition: 'color 0.4s, font-size 0.4s',
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
                            color: error['imgSource.url'] ? theme => theme.palette.error.main : 'initial',
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
                            color={error['imgSource.url'] ? 'error' : 'primary'}
                            disabled={loading}
                        >
                            {loading ? ( // Display CircularProgress while loading
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Upload file'
                            )}
                            <VisuallyHiddenInput accept="image/*"
                                id="image-upload" type="file" multiple onChange={handleImage}
                            />
                        </Button>
                        {selectedImage ? (
                            <Typography variant="body2" color="textSecondary">
                                Selected image: {selectedImage.name}
                            </Typography>
                        ) : (
                            <Box>
                                <Typography variant="body2" color="textSecondary">Uploaded Image(s)</Typography>
                            </Box>
                        )}

                        {error['imgSource.url'] && (
                            <Typography variant='caption' sx={{ ml: 1.2 }} color="error">
                                {error['imgSource.url'].message}
                            </Typography>
                        )}
                        {selectedImageData && typeof selectedImageData === 'string' ? (
                            <img
                                src={selectedImageData}
                                alt="Selected Thumbnail"
                                style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                            />
                        ) : (
                            <Typography sx={{ m: 1 }} variant='caption' color="textSecondary">
                                Preview will appear here after selecting an image.
                            </Typography>
                        )}
                    </Box>
                </FormControl>

                {/* Category Input Component */}
                <CategoryInput
                    category={productData.category}
                    onAddCategory={handleAddCategory}
                    onRemoveCategory={handleRemoveCategory}
                    error={error && error.category}
                />




                {/* Strength and Featured */}
                <Box sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: {
                        sm: 'row',
                        xs: 'column',
                    },

                }}>
                    <FormControl sx={{
                        my: 4,
                        pl: 1,
                        pb: 1,
                        border: 1,
                        borderRadius: 1,
                        borderColor: '#CACACA',
                        '&:hover': {
                            borderColor: 'black',
                            '& .form-label-sx': {
                                color: '#1776D1',
                                fontSize: '14px',
                                transition: 'color 0.4s, font-size 0.4s',

                            },
                        },
                        ' &:not(:hover)': {
                            '& .form-label-sx': {
                                color: 'initial', // Return the text color to its original state
                                fontSize: 'inital',
                                transition: 'color 0.4s, font-size 0.4s',
                            },
                        },
                    }} component="fieldset">
                        <FormLabel
                            sx={{
                                fontSize: 16,
                                pr: 0.5,
                                pl: .5,
                            }}
                            className='form-label-sx'
                            component="legend"
                        >Strength</FormLabel>
                        <RadioGroup
                            row
                            aria-label="strength"
                            name="strength"
                            value={selectedStrength}
                            onChange={handleStrengthChange}
                        >
                            <FormControlLabel
                                value="low"
                                control={<Radio />}
                                label="Low"
                            />
                            <FormControlLabel
                                value="medium"
                                control={<Radio />}
                                label="Medium"
                            />
                            <FormControlLabel
                                value="high"
                                control={<Radio />}
                                label="High"
                            />
                        </RadioGroup>
                        {error && (
                            <Typography variant='caption' sx={{ ml: 1.2 }} color="error">
                                {error.strength}
                            </Typography>
                        )}
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }} >
                        <FormControl
                            sx={{
                                pl: 1,
                                pr: 3,
                                pb: 1,
                                border: 1,
                                borderRadius: 1,
                                borderColor: '#CACACA',
                                '&:hover': {
                                    borderColor: 'black',
                                    '& .form-label-sx': {
                                        color: '#1776D1',
                                        fontSize: '14px',
                                        transition: 'color 0.4s, font-size 0.4s',
                                        textAlign: 'center'
                                    },
                                },
                                ' &:not(:hover)': {
                                    '& .form-label-sx': {
                                        color: 'initial', // Return the text color to its original state
                                        fontSize: 'inital',
                                        transition: 'color 0.4s, font-size 0.4s',

                                    },
                                },
                            }}
                            component="fieldset"
                        >
                            <FormLabel sx={{
                                fontSize: 16,

                                pl: .5,


                            }}
                                className='form-label-sx' component="legend">Feature on Home page?</FormLabel>
                            <RadioGroup
                                row
                                aria-label="isFeatured"
                                name="isFeatured"
                                value={Boolean(productData.isFeatured)} // Use the actual Boolean value
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value={Boolean(true)}
                                    control={<Radio />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    value={Boolean(false)}
                                    control={<Radio />}
                                    label="No"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>



                {/* SEO Section */}
                <FormControl

                    sx={{
                        width: '97%',
                        my: 2,
                        pl: 1,
                        py: 1,
                        pr: 1,
                        border: 1,
                        borderRadius: 1,
                        borderColor: '#CACACA',
                        '&:hover': {
                            borderColor: 'black',
                            '& .form-label-sx': {
                                color: '#1776D1',
                                fontSize: '14px',
                                transition: 'color 0.4s, font-size 0.4s',

                            },
                        },
                        ' &:not(:hover)': {
                            '& .form-label-sx': {
                                color: 'initial', // Return the text color to its original state
                                fontSize: 'inital',
                                transition: 'color 0.4s, font-size 0.4s',
                            },
                        },
                    }}
                    component="fieldset"
                >
                    <FormLabel
                        className='form-label-sx'
                        component="legend">   Search Engine Optimization (Optional)</FormLabel>
                    <Box sx={{}} >
                        {/*<Typography variant="body2" sx={{ mt: 2, ml: '25%' }}>
                            Search Engine Optimization (Optional)
                        </Typography>*/}

                        <TextField
                            sx={{ my: 2 }}
                            name="seo.title"
                            label="SEO Title"
                            fullWidth
                            value={productData.seo['title'] ? productData.seo['title'] : ''}

                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ my: 2 }}
                            name="seo.description"
                            label="SEO Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={productData.seo['description']}
                            onChange={handleChange}
                        />

                        {/* SEO Keywords Input Component */}
                        <SeoKeywordsInput
                            seoKeywords={productData.seoKeywords}
                            onAddKeyword={handleAddKeyword}
                            onRemoveKeyword={handleRemoveKeyword}
                        />

                    </Box>
                </FormControl>
                {/* SHIPPING INPUT */}
                <FormControl

                    sx={{
                        width: '97%',

                        pl: 1,
                        py: 1,
                        pr: 1,
                        border: 1,
                        borderRadius: 1,
                        borderColor: '#CACACA',
                        '&:hover': {
                            borderColor: 'black',
                            '& .form-label-sx': {
                                color: '#1776D1',
                                fontSize: '14px',
                                transition: 'color 0.4s, font-size 0.4s',

                            },
                        },
                        ' &:not(:hover)': {
                            '& .form-label-sx': {
                                color: 'initial', // Return the text color to its original state
                                fontSize: 'inital',
                                transition: 'color 0.4s, font-size 0.4s',
                            },
                        },
                    }}
                    component="fieldset"
                >
                    <FormLabel
                        className="form-label-sx"
                        sx={{
                            fontSize: 16,

                        }}
                        component="legend">Shipping Details (Optional).</FormLabel>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', flexDirection: {
                            sm: 'row',
                            xs: 'column',
                        },
                    }} >
                        <TextField
                            sx={{ my: 2 }}
                            name="shipping.weight"
                            label="Weight (oz)"
                            type="number"
                            fullWidth
                            value={weight}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ my: 2 }}
                            name="shipping.dimensions.length"
                            label="Length (in)"
                            type="number"
                            fullWidth
                            value={length}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ my: 2 }}
                            name="shipping.dimensions.width"
                            label="Width (in)"
                            type="number"
                            fullWidth
                            value={width}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ my: 2 }}
                            name="shipping.dimensions.height"
                            label="Height (in)"
                            type="number"
                            fullWidth
                            value={height}
                            onChange={handleChange}
                        />
                    </Box>
                </FormControl>

                {/* Add more fields as needed */}
            </DialogContent>
            <DialogActions sx={{
                display: 'flex', justifyContent: 'space-between', borderTop: 1, py: 2, borderColor: '#CACACA',
                '&:hover': {
                    borderColor: 'black',
                },
            }} >
                <Button onClick={clearForm} variant='outlined' color="secondary">
                    Clear Form
                </Button>
                <Button onClick={onClose ? () => { onClose(); clearForm(); } : clearForm} variant='outlined' color="error">
                    Cancel
                </Button>
                <Button onClick={handleAddProduct} variant='outlined' color="primary">
                    {loading ? <CircularProgress /> : selectedProduct ? 'Save Changes' : 'Add Product'}
                </Button>
            </DialogActions>

        </Dialog >
    )
};

export default AddProductModal;