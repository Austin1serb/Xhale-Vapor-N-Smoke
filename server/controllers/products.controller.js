const Products = require('../models/products.model');
const { uploadToCloudinary } = require('../services/cloudinary');

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
    } = req.body;

    try {
        let imageData = {};
        if (imgSource) {
            const results = await uploadToCloudinary(imgSource, "product_images");
            imageData = results;
        }

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
        });

        res.status(200).json(product);
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
            return res.status(400).json({ errors });
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
            .then(res => res)
            .catch(res => res)
    },
    updateOne: (req, res) => {
        Products.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true })
            .then(data => {
                res.json(data)
            }).catch(err => res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        Products.deleteOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    }
}