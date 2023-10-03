const CustomersController = require('../controllers/customers.controller')
module.exports = function(app){
    app.get('/customer/test', CustomersController.test);
    app.get('/customer', CustomersController.getAll);
    app.get('/customer/:id', CustomersController.getOne);
    app.post('/customer', CustomersController.createOne);    
    app.put('/customer/:id', CustomersController.updateOne);
    app.delete('/customer/:id', CustomersController.deleteOne);
}