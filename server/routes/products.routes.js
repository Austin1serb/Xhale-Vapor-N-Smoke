const ProductsController = require('../controllers/products.controller')
module.exports = function(app){
    app.get('/product/test', ProductsController.test);
    app.get('/product', ProductsController.getAll);
    app.get('/product/:id', ProductsController.getOne);
    app.post('/product', ProductsController.createOne);    
    app.put('/product/:id', ProductsController.updateOne);
    app.delete('/product/:id', ProductsController.deleteOne);
}