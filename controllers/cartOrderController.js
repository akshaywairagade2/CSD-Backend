const cartOrder  = require('../models/cartOrders') ;   
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const user = require('../models/user');


exports.addToCart  = catchAsyncError(  
       async(req , res , next)=>{    
        
            const {hotelID , item} =  req.body ; 
            const userID =hotelID ;    
    
            const cart  = await cartOrder.findOne({userID: userID , hotelID: hotelID}) ; 
            if(!cart){ 
                await cartOrder.create({  
                     userID: userID, 
                     hotelID: hotelID,
                     orderItems:[], 
                })
            } 
           try{
            await cart.addItem(item) ;   

            res.status(200).send({success: true , message: "added Successfully" , ...cart}) ; 
           }
           catch(error){ 
               return next(new ErrorHandler(error , 401)) ; 
           }


       }
) ; 

exports.removeToCart  = catchAsyncError( 
    async(req , res , next)=>{ 
        const {hotelID , item} =  req.body ; 
        const userID =  hotelID;    
 
         const cart  = await cartOrder.findOne({userID: userID , hotelID: hotelID}) ; 
         if(!cart){ 
             await cartOrder.create({  
                  userID: userID, 
                  hotelID: hotelID,
                  orderItems:[], 
             })
         } 
        try{
         await cart.removeItem(item) ;   

         res.status(200).send({success: true , message: "added Successfully" , cart: cart}) ; 
        }
        catch(error){ 
            return next(new ErrorHandler(error , 401)) ; 
        }


    }
) ;   


exports.getCart =  async(req , res , next)=>{ 
    const hotelID = req.params.id ; 
    console.log(hotelID) ;  
    const userID  = hotelID  ; 
    console.log(userID) ; 
        const cart =  await cartOrder.findOne({userID: userID , hotelID: hotelID}) ;   
    

        if (!cart) {
            res.status(200).send({message:"cart not found" , cart: []}) ; 
        } 
        else  { 
            res.status(200).send({message: "cart found" , cart: cart}); 
        }
    }
       
; 


exports.deleteCart =  catchAsyncError( async(req , res , next)=>{ 
    const hotelID = req.params.id ; 
    const userID  = hotelID; 

    const cart =  await cartOrder.findOneAndDelete({userID: userID , hotelID: hotelID}) ; 
         
    res.status(202).send({success: true , message: "cart deleted" , cart: cart}) ; 
})