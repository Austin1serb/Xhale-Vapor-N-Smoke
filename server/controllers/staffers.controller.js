const Staffers = require('../models/staffers.model')
module.exports = {
    test : (req, res) => {
        res.json({message: "Test staffer response!"});
    },
    getAll: (req, res) => {
        Staffers.find()
            .then(data=>{res.json(data)})
            .catch(err=>res.json(err))
    },
    getOne: (req, res) => {
        Staffers.findOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    },
    createOne: (req, res) => {
        Staffers.create(req.body)
            .then(data => {
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    updateOne: (req, res) => {
        Staffers.findOneAndUpdate(
                {_id: req.params.id}, 
                req.body,
                {new: true, runValidators: true} )
            .then(data=>{
                res.json(data)
            }).catch(err=>res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        Staffers.deleteOne({_id: req.params.id})
            .then(data=>{
                res.json(data)
            }).catch(err=>res.json(err))
    }
}