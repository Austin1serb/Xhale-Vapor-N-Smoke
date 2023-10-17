
import React, { useState } from 'react';
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
    Radio, // Import MenuItem for category selection
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryInput from '../components/CategoryInput';
import SeoKeywordsInput from '../components/SeoKeywordsInput';


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
        weight: '',
        dimensions: {
            length: '',
            width: '',
            height: '',
        },
    },
};



const AddProductModal = ({ open, onClose, onAddProduct }) => {
    const [productData, setProductData] = useState(initialProductData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageData, setSelectedImageData] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState('low');



    const handleStrengthChange = (event) => {
        setSelectedStrength(event.target.value);
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




    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('seoKeywords')) {
            const seoField = name.split('.')[1];
            setProductData({
                ...productData,
                seo: {
                    ...productData.seo,
                    [seoField]: value,
                },
            });
        } else if (name.startsWith('shipping.')) {
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
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };




    const handleAddProduct = async () => {
        try {
            setLoading(true);
            const strength = selectedStrength; // Store the selected strength
            productData.strength = strength;
            const response = await fetch('http://localhost:8000/api/product/', {
                method: 'POST',
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
                // Registration failed, handle error response
                const errorData = await response.json();
                if (errorData.errors) {
                    setError(errorData.errors);
                } else {
                    console.error('Registration error:', errorData.message);
                    // Handle other error cases as needed
                }
            }
        } catch (error) {
            console.error('Error adding product:', error);
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
            setProductData({ ...productData, ["imgSource"]: reader.result })
            setSelectedImage(file);
            setSelectedImageData(reader.result); // Set the selected image data for the thumbnail
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
    const { weight, dimensions } = shipping;
    // Destructure the properties within dimensions
    const { length, width, height } = dimensions;
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{ backgroundColor: '#1776D1', color: 'white', borderRadius: 1 }}
            >Add New Product</DialogTitle>
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
                    sx={{ my: 2 }}
                    name="brand"
                    label="Brand*"
                    fullWidth
                    error={Boolean(error)}
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
                    error={Boolean(error)}
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
                    error={Boolean(error)}
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
                    error={Boolean(error)}
                    helperText={error.description}
                    value={productData.description}
                    onChange={handleChange}
                />

                {/* Image Upload */}

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
                        },
                    }}
                    component="fieldset"
                >
                    <FormLabel component="legend"> Upload an image*</FormLabel>
                    <Box sx={{
                        my: 2, ml: .25, pl: 1,
                        py: 1,
                        border: 1,
                        borderRadius: 1,
                        borderColor: '#CACACA',
                        "&:hover": {
                            borderColor: "black",
                        },
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            onChange={handleImage}
                        />
                        <label htmlFor="image-upload">
                            <Button
                                sx={{ m: 1, flexWrap: 'wrap' }}
                                component="span"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                            >
                                Choose File
                            </Button>
                        </label>
                        {selectedImage && (
                            <Typography variant="body2" color="textSecondary">
                                Selected image: {selectedImage.name}
                            </Typography>
                        )}
                        {error && (
                            <Typography variant='caption' sx={{ ml: 1.2 }} color="error">
                                {error && error['imgSource.url']}
                            </Typography>
                        )}
                        {selectedImageData && (
                            <img
                                src={selectedImageData}
                                alt="Selected Thumbnail"
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                        )}
                    </Box>
                </FormControl>
                {/* Category Input Component */}
                <CategoryInput
                    category={productData.category}
                    onAddCategory={handleAddCategory}
                    onRemoveCategory={handleRemoveCategory}
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
                        "&:hover": {
                            borderColor: "black",
                        },
                    }} component="fieldset">
                        <FormLabel component="legend">Strength</FormLabel>
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

                    <FormControl
                        sx={{
                            pl: 1,
                            pr: 1,
                            pb: 1,
                            border: 1,
                            borderRadius: 1,
                            borderColor: '#CACACA',
                            "&:hover": {
                                borderColor: "black",
                            },

                        }}
                        component="fieldset"
                    >
                        <FormLabel sx={{ px: 0.1 }} component="legend">Feature on Home page?</FormLabel>
                        <RadioGroup
                            row
                            aria-label="isFeatured"
                            name="isFeatured"
                            value={productData.isFeatured} // Use the actual Boolean value
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Yes"
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>
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
                        },
                    }}
                    component="fieldset"
                >
                    <FormLabel component="legend">   Search Engine Optimization (Optional)</FormLabel>
                    <Box sx={{}} >
                        {/*<Typography variant="body2" sx={{ mt: 2, ml: '25%' }}>
                            Search Engine Optimization (Optional)
                        </Typography>*/}

                        <TextField
                            sx={{ my: 2 }}
                            name="seo.title"
                            label="SEO Title"
                            fullWidth
                            value={productData['seo.title'] ? productData['seo.title'] : ''}

                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ my: 2 }}
                            name="seo.description"
                            label="SEO Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={productData['seo.description']}
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
                        },

                    }}
                    component="fieldset"
                >
                    <FormLabel component="legend">Shipping Details (Optional).</FormLabel>
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
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', border: .1, borderRadius: 1, m: 1 }} >
                <Button onClick={clearForm} variant='outlined' color="secondary">
                    Clear Form
                </Button>
                <Button onClick={onClose} variant='outlined' color="error">
                    Cancel
                </Button>
                <Button onClick={handleAddProduct} variant='outlined' color="primary">
                    {loading ? <CircularProgress /> : 'Add Product'}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default AddProductModal;