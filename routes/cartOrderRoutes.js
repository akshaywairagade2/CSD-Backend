const express  = require('express') ; 
const router  = express.Router() ; 
const cartOrder = require('../controllers/cartOrderController') ;  
const { auth } = require('../middlewares/auth');



router.route('/add').post( cartOrder.addToCart) ; 
router.route('/remove').post( cartOrder.removeToCart) ;      
router.route('/cart/:id').get( cartOrder.getCart) ; 
router.route('/cart/:id').delete(cartOrder.deleteCart); 

module.exports = router;