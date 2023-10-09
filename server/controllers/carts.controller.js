const Carts = require('../models/carts.model')
module.exports = {
    test : (req, res) => {
        res.json({message: "Test cart response!"});
    },
    getAll: (req, res) => {
        Carts.find()
            .then(data=>{res.json(data)})
            .catch(err=>res.json(err))
    },
    getOne: (req, res) => {
        Carts.findOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    },
    createOne: (req, res) => {
        Carts.create(req.body)
            .then(data => {
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    updateOne: (req, res) => {
        Carts.findOneAndUpdate(
                {_id: req.params.id}, 
                req.body,
                {new: true, runValidators: true} )
            .then(data=>{
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        Carts.deleteOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    }
}