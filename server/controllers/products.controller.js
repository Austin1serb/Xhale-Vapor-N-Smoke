const Products = require('../models/products.model')
const { uploadToCloudinary } = require('../services/cloudinary')

const createOneProd = async (req, res) => {
    const {
        brand,
        name,
        price,
        imgSource,
        category,
        description,
        strength,
        inventory,
        reorderPoint
    } = req.body;

    try{
        let imageData = {}
        if(imgSource){
            const results = await uploadToCloudinary(imgSource, "product_images")
            imageData = results
        }
        const product = await Products.create({
            brand,
            name,
            price,
            imgSource: imageData,
            category,
            description,
            strength,
            inventory,
            reorderPoint
        })
        res.status(200).json(product)
    } catch(err){
        console.log("error res");
        res.status(500).json({error: "A server error occured with this request"})
    }
}

module.exports = {
    test : (req, res) => {
        res.json({message: "Test product response!"});
    },
    getAll: (req, res) => {
        Products.find()
            .then(data=>{res.json(data)})
            .catch(err=>res.json(err))
    },
    getOne: (req, res) => {
        Products.findOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    },
    createOne: (req, res) => {
        createOneProd(req, res)
            .then(res => res)
            .catch(res => res)
    },
    updateOne: (req, res) => {
        Products.findOneAndUpdate(
                {_id: req.params.id}, 
                req.body,
                {new: true, runValidators: true} )
            .then(data=>{
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        Products.deleteOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    }
}