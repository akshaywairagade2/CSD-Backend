const jwt = require('jsonwebtoken');
const catchAsyncError = require('./catchAsyncError'); 

exports.auth = catchAsyncError( async (req, res, next) => {
  
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
        const decodeData =  jwt.verify(token , process.env.JWT_SECRET) ;  
        console.log("customAuth") ; 
        req.userID= decodeData?.id ; 
        next() ; 
    } 
    else {
      decodedData = jwt.decode(token);

      req.userID = decodedData?.sub;
      next();
    }    

  } 
  
);
