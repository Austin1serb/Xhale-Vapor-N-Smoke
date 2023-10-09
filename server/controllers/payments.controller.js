const Payments = require('../models/payments.model')
module.exports = {
    test : (req, res) => {
        res.json({message: "Test payment response!"});
    },
    getAll: (req, res) => {
        Payments.find()
            .then(data=>{res.json(data)})
            .catch(err=>res.json(err))
    },
    getOne: (req, res) => {
        Payments.findOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    },
    createOne: (req, res) => {
        Payments.create(req.body)
            .then(data => {
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    updateOne: (req, res) => {
        Payments.findOneAndUpdate(
                {_id: req.params.id}, 
                req.body,
                {new: true, runValidators: true} )
            .then(data=>{
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        Payments.deleteOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    }
}