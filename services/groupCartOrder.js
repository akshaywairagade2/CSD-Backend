const catchAsyncError = require('../middlewares/catchAsyncError');
const item = require('../models/items') ; 

exports.getItem =  catchAsyncError(async(itemId)=>{ 
      const item  = await item.findById({_id: itemId}) ; 
      return item ;          
})