const OrderItems = require('../models/orderItems.model')
module.exports = {
    test : (req, res) => {
        res.json({message: "Test order item response!"});
    },
    getAll: (req, res) => {
        OrderItems.find()
            .then(data=>{res.json(data)})
            .catch(err=>res.json(err))
    },
    getOne: (req, res) => {
        OrderItems.findOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    },
    createOne: (req, res) => {
        OrderItems.create(req.body)
            .then(data => {
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    updateOne: (req, res) => {
        OrderItems.findOneAndUpdate(
                {_id: req.params.id}, 
                req.body,
                {new: true, runValidators: true} )
            .then(data=>{
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        OrderItems.deleteOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    }
}