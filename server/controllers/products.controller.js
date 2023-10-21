const Products = require('../models/products.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');


const createOneProd = async (req, res) => {
    const {
        brand,
        name,
        price,
        imgSource,
        category,
        description,
        strength,
        reorderPoint,
        seo,
        seoKeywords,
        shipping,
        isFeatured,
    } = req.body;

    const isUpdate = Boolean(req.params.id); // Check if an ID is provided to determine if it's an update


    try {
        let imageData = {};
        if (imgSource && imgSource.url) {
            // Use the imgSource.url as the local file path
            const results = await uploadToCloudinary(imgSource.url, "product_images");
            imageData = results;

        } else if (imgSource) {
            const results = await uploadToCloudinary(imgSource, "product_images");
            imageData = results;
        }
        console.log(imageData)
        if (isUpdate) {
            // Handle product update
            const updatedProduct = await Products.findOneAndUpdate(
                { _id: req.params.id },
                {
                    brand,
                    name,
                    price,
                    imgSource: imageData,
                    category,
                    description,
                    strength,
                    reorderPoint,
                    seo,
                    seoKeywords,
                    shipping,
                    isFeatured,
                },
                { new: true, runValidators: true }
            );

            if (updatedProduct) {
                res.status(200).json(updatedProduct);
            } else {
                // Handle product not found or other errors
                res.status(404).json({ message: 'Product not found' });
            }
        } else {
            // Handle product creation
            const product = await Products.create({
                brand,
                name,
                price,
                imgSource: imageData,
                category,
                description,
                strength,
                reorderPoint,
                seo,
                seoKeywords,
                shipping,
                isFeatured,
            });

            res.status(200).json(product);
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            // Handle nested fields
            if (error.errors['imgSource']) {
                errors.imgSource = {};

                if (error.errors['imgSource.publicId']) {
                    errors.imgSource.publicId = error.errors['imgSource.publicId'].message;
                }

                if (error.errors['imgSource.url']) {
                    errors.imgSource.url = error.errors['imgSource.url'].message;
                }
            }
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json(errors);
        }
        return res.status(500).json({ message: 'Server error' + error, error: error });
    }
};

module.exports = {
    test: (req, res) => {
        res.json({ message: "Test product response!" });
    },
    getAll: (req, res) => {
        Products.find()
            .then(data => { res.json(data) })
            .catch(err => res.json(err))
    },
    getOne: (req, res) => {
        Products.findOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
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

            // Check if the product has an associated image and delete it from Cloudinary
            if (product.imgSource && product.imgSource.publicId) {
                await deleteFromCloudinary(product.imgSource.publicId);
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