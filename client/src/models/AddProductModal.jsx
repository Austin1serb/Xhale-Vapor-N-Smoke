
import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,

    CircularProgress,
    Snackbar,
    Alert,

} from '@mui/material';
import CategoryInput from '../components/CategoryInput';
import ImageUpload from './ImageUpload';
import StrengthFeaturedControl from './StrengthFeaturedControl';
import SEOSection from './SEOSection';
import ShippingInput from './ShippingInput';

const initialProductData = {
    brand: '',
    name: '',
    price: '',
    specs: '',
    totalSold: 0,
    imgSource: [],
    category: [],
    description: '',
    strength: 'low',
    isFeatured: false,
    flavor: '',
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
    const [error, setError] = useState({});
    const [selectedImage, setSelectedImage] = useState([]);
    const [selectedImageData, setSelectedImageData] = useState([]);
    const [selectedStrength, setSelectedStrength] = useState('low');
    const [isNewImageSelected, setIsNewImageSelected] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const openSnackbar = (errorData) => {
        // Extract the first error message from errorData object
        const firstError = Object.values(errorData)[0];
        setSnackbarMessage(firstError);
        setIsSnackbarOpen(true);
    };


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


    const clearForm = () => {
        setProductData(initialProductData);
        setError({});
        setSelectedImage([]);
        setSelectedImageData([]);
        setSelectedStrength('low');
        setLoading(false)
    };


    useEffect(() => {
        setProductData((prevData) => ({
            ...prevData,
            imgSource: selectedImageData.map(urlOrObj => {
                if (typeof urlOrObj === 'string') {
                    const existingImageInfo = selectedProduct ? selectedProduct.imgSource.find(img => img.url === urlOrObj) : null;
                    return {
                        url: urlOrObj,
                        publicId: existingImageInfo ? existingImageInfo.publicId : undefined
                    };
                }
                return urlOrObj; // if it's already an object, just return as is
            }),
        }));
    }, [selectedImageData, selectedProduct]);




    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct);
            setSelectedStrength(selectedProduct.strength);

            // Check if selectedProduct has an image source
            if (selectedProduct.imgSource && selectedProduct.imgSource.length > 0) {
                setSelectedImageData(selectedProduct.imgSource.map(imageObj => imageObj.url));
            } else {
                setSelectedImageData([]);
            }


        } else {
            setProductData(initialProductData);
            setSelectedImageData([]);
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






    const API_URL = 'http://localhost:8000/api/product/';
    const HEADERS = {
        'Content-Type': 'application/json',
    };


    const handleAddProduct = async () => {
        try {
            setLoading(true);

            const productToUpdate = prepareProductData();

            const endpoint = selectedProduct ? `${API_URL}${selectedProduct._id}` : API_URL;
            const method = selectedProduct ? 'PUT' : 'POST';

            const response = await makeApiCall(endpoint, method, productToUpdate);

            await handleApiResponse(response);
        } catch (error) {
            console.error('Error adding/updating product:', error);
        } finally {
            setLoading(false);
        }
    };

    const prepareProductData = () => {
        const productDataCopy = { ...productData, strength: selectedStrength };

        const imageSource = selectedProduct ? formatImagesForUpdate() : formatImagesForNewProduct();
        productDataCopy.imgSource = imageSource || [];

        return productDataCopy;
    };

    const formatImagesForUpdate = () => {
        if (Array.isArray(selectedImageData) && selectedImageData.length) {
            return selectedImageData.map(url => {
                const existingImageInfo = selectedProduct.imgSource.find(img => img.url === url);
                return {
                    url,
                    publicId: existingImageInfo ? existingImageInfo.publicId : undefined
                };
            });
        }
    };

    const formatImagesForNewProduct = () => {
        if (Array.isArray(selectedImageData) && selectedImageData.length) {
            return selectedImageData.map(url => ({ url }));
        }
    };

    const makeApiCall = async (url, method, data) => {
        return fetch(url, {
            method,
            headers: HEADERS,
            credentials: 'include',
            body: JSON.stringify(data),
        });
    };

    const handleApiResponse = async (response) => {
        if (response.ok) {
            const product = await response.json();
            if (selectedProduct) {
                onUpdateProduct(product);
            } else {
                onAddProduct(product);
            }
            clearForm();
            onClose();
        } else {
            const errorData = await response.json();

            setError(errorData);
            openSnackbar(errorData);
            console.error('API error:', errorData.message || errorData);
        }
    };



    // receive file from form
    const handleImage = (e) => {
        const files = Array.from(e.target.files); // Convert the FileList to an array
        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                // Add the new image URL to selectedImageData
                setSelectedImageData(prevImages => [...prevImages, reader.result]);
            };
        });
        setSelectedImage(files);
        setIsNewImageSelected(true);
    };





    const handleCancel = () => {
        if (onClose) {
            onClose();
        }
        clearForm();
    }



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
    const weight = shipping?.weight || '';
    const dimensions = shipping?.dimensions || {};
    const length = dimensions.length || '';
    const width = dimensions.width || '';
    const height = dimensions.height || '';

    const paperProps = {
        style: {
            borderRadius: '5px',

            border: error.errors ? '1px solid red' : 'none'
        },
    };

    const buttonOptions = selectedProduct ? 'Save Changes' : 'Add Product'

    return (
        <>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={4000} // Adjust the duration as needed
                onClose={() => setIsSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity="error" onClose={() => setIsSnackbarOpen(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog open={open} PaperProps={paperProps}>


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
                        autoComplete='true'
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
                        autoComplete='true'
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
                        autoComplete='false'
                        onWheel={(e) => e.target.blur()}
                    />
                    {/* Specs */}
                    <TextField
                        sx={{ my: 2 }}
                        name="specs"
                        label="Specs*"
                        fullWidth
                        error={Boolean(error.specs)}
                        helperText={error.specs}
                        value={productData.specs}
                        onChange={handleChange}
                        autoComplete='true'
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
                        autoComplete='true'
                    />
                    {/* Flavor */}
                    <TextField
                        sx={{ my: 2 }}
                        name="flavor"
                        label="Flavor"
                        multiline
                        rows={1}
                        fullWidth
                        value={productData.flavor}
                        onChange={handleChange}
                        spellCheck={true}
                        autoComplete='true'
                    />
                    <TextField
                        sx={{ my: 2 }}
                        name="totalSold"
                        label="Units Sold"
                        multiline
                        rows={1}
                        fullWidth
                        value={productData.totalSold}
                        onChange={handleChange}
                        autoComplete='true'
                    />
                    {/* Category Input Component */}
                    <CategoryInput
                        category={productData.category}
                        onAddCategory={handleAddCategory}
                        onRemoveCategory={handleRemoveCategory}
                        error={error && error.category}
                    />

                    {/* Image Upload */}
                    <ImageUpload
                        error={error}
                        loading={loading}
                        selectedImage={selectedImage}
                        selectedImageData={selectedImageData}
                        handleImage={handleImage}
                        setSelectedImageData={setSelectedImageData}
                    />









                    {/* Strength and Featured */}
                    <StrengthFeaturedControl
                        selectedStrength={selectedStrength}
                        handleStrengthChange={handleStrengthChange}
                        productData={productData}
                        handleChange={handleChange}
                        error={error}
                    />



                    {/* SEO Section */}
                    <SEOSection
                        productData={productData}
                        handleChange={handleChange}
                        handleAddKeyword={handleAddKeyword}
                        handleRemoveKeyword={handleRemoveKeyword}
                    />

                    {/* SHIPPING INPUT */}
                    <ShippingInput
                        weight={weight}
                        length={length}
                        width={width}
                        height={height}
                        handleChange={handleChange}
                    />

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
                    <Button onClick={handleCancel} variant='outlined' color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleAddProduct} variant='outlined' color="primary">
                        {loading ? <CircularProgress /> : buttonOptions}
                    </Button>
                </DialogActions>

            </Dialog >
        </>
    )
};

export default AddProductModal;