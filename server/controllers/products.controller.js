const Products = require('../models/products.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');

const createOneProd = async (req, res) => {
    console.log(req.body);
    const {
        brand,
        name,
        price,
        specs,
        imgSource,
        category,
        description,
        strength,
        reorderPoint,
        seo,
        seoKeywords,
        shipping,
        isFeatured,
        flavor,
    } = req.body;

    const isUpdate = Boolean(req.params.id); // Check if an ID is provided to determine if it's an update
    let originalImages = [];
    let originalProduct;

    try {
        let imageData = [];

        if (isUpdate) {
            // Fetch the original product first
            originalProduct = await Products.findById(req.params.id);
            if (!originalProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            originalImages = originalProduct.imgSource.map(img => img.url);
        }

        if (imgSource && Array.isArray(imgSource) && imgSource.length > 0) {
            for (let image of imgSource) {
                if (image.url && image.url.includes('cloudinary.com')) {
                    imageData.push(image);
                } else {
                    const results = await uploadToCloudinary(image.url, "product_images");
                    imageData.push(results);
                }
            }
        }

        if (isUpdate) {
            // Identify removed images
            const removedImages = originalImages.filter(oriUrl => !imageData.some(newImg => newImg.url === oriUrl));

            // Delete them from Cloudinary
            for (const removedImage of removedImages) {
                const publicId = originalProduct.imgSource.find(img => img.url === removedImage).publicId;
                await deleteFromCloudinary(publicId);
            }
        }

        const productData = {
            brand,
            name,
            price,
            specs,
            imgSource: imageData,
            category,
            description,
            strength,
            reorderPoint,
            seo,
            seoKeywords,
            shipping,
            isFeatured,
            flavor,
        };

        let product;
        if (isUpdate) {
            product = await Products.findOneAndUpdate({ _id: req.params.id }, productData, {
                new: true,
                runValidators: true,
            });
        } else {
            product = await Products.create(productData);
        }

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found or could not be updated' });
        }

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json(errors);
        }
    }
};

module.exports = {
    test: (req, res) => {
        res.json({ message: "Test product response!" });
    },
    getAllPaginate: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10; // Set a default page size

        try {
            const skip = (page - 1) * pageSize;
            const totalProducts = await Products.countDocuments();
            const products = await Products.find().skip(skip).limit(pageSize);

            res.status(200).json({
                products,
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / pageSize),
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error });
        }
    },

    getAll: (req, res) => {
        Products.find() // Find all products
            .then(products => {
                // Return the list of products as a JSON response
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