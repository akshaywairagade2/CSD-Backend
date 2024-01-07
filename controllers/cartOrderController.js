const cartOrder  = require('../models/cartOrders') ;   
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const user = require('../models/user'); 
const mongoose  = require('mongoose') ; 


exports.addToCart  = catchAsyncError(  
       async(req , res , next)=>{    
        
            const {hotelID , item} =  req.body ; 
            const userID = req.userID ;    
    
            const cart  = await cartOrder.findOne({userID: userID , hotelID: hotelID}) ; 
            if(!cart){ 
                await cartOrder.create({  
                     userID: userID, 
                     hotelID: hotelID,
                     orderItems:[], 
                })
            } 
          
            await cart.addItem(item) ;   

            res.status(200).send({success: true , message: "added Successfully" , ...cart}) ; 
           

       }
) ; 

exports.removeToCart  = catchAsyncError( 
    async(req , res , next)=>{ 
        const {hotelID , item} =  req.body ; 
        const userID =  req.userID;    
 
         const cart  = await cartOrder.findOne({ userID: userID , hotelID: hotelID}) ; 
         if(!cart){ 
             await cartOrder.create({  
                  userID: userID, 
                  hotelID: hotelID,
                  orderItems:[], 
             })
         } 
        try{
         await cart.removeItem(item) ;   

         res.status(200).send({success: true , message: "removed Successfully" , cart: cart}) ; 
        }
        catch(error){ 
            return next(new ErrorHandler(error , 401)) ; 
        }


    }
) ;   


exports.getCart =  async(req , res , next)=>{ 
    const hotelID = req.params.id ; 
    console.log(hotelID) ;  
    const userID  = req.userID  ; 
    console.log(userID) ; 
        const cart =  await cartOrder.find({userID: userID , hotelID: hotelID}) ;   
    
        console.log(cart) ; 
        if (!cart) {
            res.status(200).send({message:"cart not found" , cart: []}) ; 
        } 
        else  { 
            res.status(200).send({message: "cart found" , items: cart}); 
        }
    }
       
; 


exports.deleteCart =  catchAsyncError( async(req , res , next)=>{ 
    const hotelID = req.params.id ; 
    const userID  = req.userID; 

    const cart =  await cartOrder.findOneAndDelete({userID: userID , hotelID: hotelID}) ; 
         
    res.status(202).send({success: true , message: "cart deleted" , cart: cart}) ; 
})