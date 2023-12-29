const Products = require('../models/products.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');

const createOneProd = async (req, res) => {

    const productData = extractProductData(req.body);
    const isUpdate = Boolean(req.params.id);

    try {
        if (isUpdate) {
            await updateProduct(req, res, productData);
        } else {
            await createProduct(res, productData);
        }
    } catch (error) {
        handleErrors(error, res);
    }
};

const extractProductData = (body) => {
    const { brand, name, price, specs, imgSource, category, description, strength, reorderPoint, seo, seoKeywords, shipping, isFeatured, flavor, totalSold } = body;
    return { brand, name, price, specs, imgSource, category, description, strength, reorderPoint, seo, seoKeywords, shipping, isFeatured, flavor, totalSold };
};

const updateProduct = async (req, res, productData) => {
    const originalProduct = await Products.findById(req.params.id);
    if (!originalProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }

    productData.imgSource = await processImages(productData.imgSource, originalProduct);
    await removeDeletedImages(productData.imgSource, originalProduct);

    const updatedProduct = await Products.findOneAndUpdate({ _id: req.params.id }, productData, { new: true, runValidators: true });

    if (updatedProduct) {
        res.status(200).json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product could not be updated' });
    }
};

const createProduct = async (res, productData) => {
    productData.imgSource = await processImages(productData.imgSource);
    const newProduct = await Products.create(productData);

    if (newProduct) {
        res.status(200).json(newProduct);
    } else {
        res.status(400).json({ message: 'Product could not be created' });
    }
};

const processImages = async (images, originalProduct = null) => {
    let imageData = [];
    if (images && Array.isArray(images) && images.length > 0) {
        for (let image of images) {
            if (image.url && image.url.includes('cloudinary.com')) {
                imageData.push(image);
            } else {
                const results = await uploadToCloudinary(image.url, "product_images");
                imageData.push(results);
            }
        }
    }
    return imageData;
};

const removeDeletedImages = async (newImages, originalProduct) => {
    const originalUrls = originalProduct.imgSource.map(img => img.url);
    const removedUrls = originalUrls.filter(url => !newImages.some(img => img.url === url));

    for (const url of removedUrls) {
        const publicId = originalProduct.imgSource.find(img => img.url === url).publicId;
        await deleteFromCloudinary(publicId);
    }
};

const handleErrors = (error, res) => {
    console.error(error);
    if (error.name === 'ValidationError') {
        const errors = Object.keys(error.errors).reduce((acc, field) => {
            acc[field] = error.errors[field].message;
            return acc;
        }, {});
        return res.status(400).json(errors);
    }
    res.status(500).json({ message: 'An unexpected error occurred' });
};


module.exports = {
    test: (req, res) => {
        res.json({ message: "Test product response!" });
    },
    getAllPaginate: async (req, res) => {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const filter = req.query.filter || '';

        try {
            const skip = (page - 1) * pageSize;
            let query = {};
            let sort = {};

            if (filter === 'best-sellers') {
                sort = { totalSold: -1 };
            } else if (filter === 'new-products') {
                sort = { createdAt: -1 };
            } else if (filter === 'featured') {
                query = { isFeatured: true };
            } else if (filter.includes('brand-')) {
                // Extract brand name from filter and create a case-insensitive regex query
                const brand = filter.split('brand-')[1];
                query = { brand: new RegExp(`^${brand}$`, 'i') };
            } else if (filter === 'high-potency') {
                query = { strength: 'high' };
            } else if (filter) {
                // Using a case-insensitive regex for category
                query = { category: new RegExp(filter, 'i') };
            }


            const totalProducts = await Products.countDocuments(query);
            const products = await Products.find(query).sort(sort).skip(skip).limit(pageSize);

            res.status(200).json({
                products,
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / pageSize),
                totalProducts: totalProducts,
            });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error });
        }
    },



    getAll: (req, res) => {
        Products.find() // Find all products
            .sort({ name: 1 }) // Sort products by 'name' field in ascending order (A to Z)
            .then(products => {
                // Return the sorted list of products as a JSON response
                res.json(products);
            })
            .catch(err => {
                // Handle any errors that occur during the database query
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            });
    },


    getOne: (req, res) => {
        Products.findOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    },


    // Search products based on the search term and filter
    searchProducts: async (req, res) => {

        try {

            const searchTerm = req.query.term;
            const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
            const filter = req.query.filter || '';
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * pageSize;

            // Create a regex for case-insensitive partial matching
            const searchRegex = new RegExp(searchTerm, 'i');

            let query = {
                $and: [
                    {
                        $or: [
                            { name: { $regex: searchRegex } },
                            { brand: { $regex: searchRegex } },
                            { specs: { $regex: searchRegex } },
                            { flavor: { $regex: searchRegex } },
                            { strength: { $regex: searchRegex } },
                            { category: { $elemMatch: { $regex: searchRegex } } }
                        ]
                    }
                ]
            };

            // Add filter logic
            if (filter === 'best-sellers') {
                query.$and.push({ totalSold: { $exists: true } }); // Modify this condition based on your schema
            } else if (filter === 'new-products') {
                query.$and.push({ createdAt: { $exists: true } }); // Modify this condition based on your schema
            } else if (filter === 'featured') {
                query.$and.push({ isFeatured: true });
            } else if (filter.includes('brand-')) {
                const brand = filter.split('brand-')[1];
                query.$and.push({ brand: new RegExp(`^${brand}$`, 'i') });
            } else if (filter === 'high-potency') {
                query.$and.push({ strength: 'high' });
            } else if (filter) {
                query.$and.push({ category: new RegExp(filter, 'i') });
            }


            const totalProducts = await Products.countDocuments(query);
            const products = await Products.find(query).limit(pageSize).skip(skip);

            res.json({ products, totalProducts, currentPage: page, totalPages: Math.ceil(totalProducts / pageSize) });
        } catch (error) {
            res.status(500).send("Error occurred while fetching products.");
        }
    },




    getBestSellers: async (req, res) => {

        const limit = parseInt(req.query.limit) || 3; // Default to 3 if limit is not provided or invalid

        try {
            const bestSellers = await Products.find({}).sort({ totalSold: -1 }).limit(limit);

            res.json(bestSellers);
        } catch (err) {
            console.error('Error fetching best sellers:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    getFeatured: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5; // Set a default limit or take from query string
            const featuredProducts = await Products.find({ isFeatured: true }).limit(limit);
            res.status(200).json(featuredProducts);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error });
        }
    },



    createOne: (req, res) => {
        createOneProd(req, res)


    },
    updateOne: (req, res) => {
        createOneProd(req, res);
    },

    deleteOne: async (req, res) => {
        try {
            const product = await Products.findOne({ _id: req.params.id });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Check if the product has associated images and delete them from Cloudinary
            if (product.imgSource && product.imgSource.length > 0) {
                // Loop through the images and delete them
                for (const image of product.imgSource) {
                    await deleteFromCloudinary(image.publicId);
                }
            }

            // Delete the product from the database
            const deletionResult = await Products.deleteOne({ _id: req.params.id });

            if (deletionResult.deletedCount === 1) {
                res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error });
        }
    },

}
