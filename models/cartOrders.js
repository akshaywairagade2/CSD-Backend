const mongoose =  require('mongoose') ; 

const cartOrderSchema =  new mongoose.Schema(
    {  
       user : { 
         type:mongoose.Schema.ObjectId, 
         ref : "User",  
         required: true, 
       }, 
       server :{ 
        type:mongoose.Schema.ObjectId, 
        ref : "User",  
        required: true ,
       }, 
       orderItems: [{ 
           name: { 
             type: String , 
             required: true  ,  
           }, 
           price: { 
              type: Number, 
              required: true, 
           }, 
           quantity: { 
              type: Number, 
              required: true, 
           }, 
           item: { 
            type:mongoose.Schema.ObjectId, 
            ref : "Item",
            required: true , 
           }
       }] ,
     
       }


    
); 

module.exports = mongoose.model('CartOrder' , cartOrderSchema) ; 