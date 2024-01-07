const express  = require('express') ; 
const router  = express.Router() ; 
const cartOrder = require('../controllers/cartOrderController') ;  
const { auth } = require('../middlewares/auth');



router.route('/add').post(auth ,  cartOrder.addToCart) ; 
router.route('/remove').post( auth , cartOrder.removeToCart) ;      
router.route('/cart/:id').get( auth , cartOrder.getCart) ; 
router.route('/cart/:id').delete(auth , cartOrder.deleteCart); 

module.exports = router;