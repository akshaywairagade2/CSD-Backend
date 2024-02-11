const catchAsyncError = require('../middlewares/catchAsyncError');
const Groups = require('../models/groupOrders') ; 
const ErrorHandler = require('../utils/errorhandler');
const {getItem} = require("./../services/groupCartOrder"); 

exports.createGroup = async (req, res) => {
    const { hotelId, userName, userId, groupId, groupName } = req.body;
    const userIds = [userId];
    const adminId = userId;
    const cartItemsForUser = [];

    try {
        const group = await Groups.create({
            adminId,
            hotelId,
            groupId,
            groupName, 
            userIds,
            cartItems: new Map(),
        });

        group.cartItems.set(userId, { userId, userName, items: cartItemsForUser });

        await group.save();

        return res.status(201).json({ msg: "Group Created Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}



exports.joinGroup = async (req, res) => {
    const { userName, userId, groupId } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    if (!group){
        return res.status(400).json({msg : "Group Not Found"})
    }
    try {
        group.userIds.push(userId)
        const cartItemsForUser = [];
    
        group.cartItems.set(userId, { userId, userName, items: cartItemsForUser });

        await group.save();

        return res.status(201).json({ msg: "User Added Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error });
    }
}; 

exports.addItem = catchAsyncError(async(req , res , next)=>{ 
    const {groupId,userId, userName, item} = req.body ;  
    const group = await Groups.findOne({groupId: groupId }) ;   
    if(!item){ 
        return next(new ErrorHandler("Item not found" , 404)) ; 
     }    
    if(!group){ 
        return next(new ErrorHandler("Group not found" , 404)) ; 
     }   
    try {
    await group.addItem(userId, userName, item) ; 
    await group.save() ; 

    res.status(200).send({  
         success: true , 
         message: "item added successfully", 
    }); 


    }
    catch(err){
        res.status(500).send({
              message: err, 
              success: false,  
        })
    }
})

exports.removeItem = catchAsyncError(async(req , res , next)=>{ 
    const {groupId , itemId, userId, userName} = req.body ; 
    const group = Groups.findOne({groupId: groupId});  
     if(!item){ 
           return next(new ErrorHandler("Item not found", 404)) ; 
     }  
     if(!group){ 
        return next(new ErrorHandler("Group not found" , 404)) ; 
     }     
     
     try{
     await group.removeItem(userId, userName , item);  
     res.status(200).send({success:true , message: "Item removed successfully"});
     }
     catch(err){ 
     res.status(500).send({success: false , message: "Error removing item"}) ;  
     }
});    

exports.deleteItem = catchAsyncError(async(req , res , next)=>{ 
    const {groupId , itemId, userId, userName} = req.body ; 
    const group = Groups.findOne({groupId: groupId});  
     if(!item){ 
           return next(new ErrorHandler("Item not found", 404)) ; 
     }  
     if(!group){ 
        return next(new ErrorHandler("Group not found" , 404)) ; 
     }     
     
     try{
     await group.deleteItem(userId, userName , item);  
     res.status(200).send({success:true , message: "Item deleted successfully"});
     }
     catch(err){ 
     res.status(500).send({success: false , message: "Error deleting item"}) ;  
     }
});      

exports.deleteCart = catchAsyncError(async(req , res , next)=>{ 
    const {groupId , itemId, userId, userName} = req.body ; 
    const group = Groups.findOne({groupId: groupId});  
     if(!item){ 
           return next(new ErrorHandler("Item not found", 404)) ; 
     }  
     if(!group){ 
        return next(new ErrorHandler("Group not found" , 404)) ; 
     }     
     
     try{
     await group.deleteCart(userId, userName);  
     res.status(200).send({success:true , message: "Cart deleted successfully"});
     }
     catch(err){ 
     res.status(500).send({success: false , message: "Error deleting Cart"}) ;  
     }
});    
