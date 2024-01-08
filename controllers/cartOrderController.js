const cartOrder = require('../models/cartOrders');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middlewares/catchAsyncError');


exports.addToCart = catchAsyncError(
    async (req, res, next) => {
        try {
            const { hotelID, item } = req.body;
            const userID = req.userID;

            var cart = await cartOrder.findOne({ userID: userID, hotelID: hotelID });

            if (!cart) {

                cart = await cartOrder.create({
                    userID: userID,
                    hotelID: hotelID,
                    orderItems: [],
                })
            }

            await cart.addItem(item);
            res.status(200).send({ success: true, message: "added Successfully", ...cart });
        }

        catch (error) {
            res.status(400).send({ message: error })
        }
    }
);

exports.removeToCart = catchAsyncError(
    async (req, res, next) => {
        const { hotelID, item } = req.body;
        const userID = req.userID;

        const cart = await cartOrder.findOne({ userID: userID, hotelID: hotelID });
        try {
            await cart.removeItem(item);
            const orderItems = cart?.orderItems;

            res.status(200).send({ success: true, message: "removed Successfully", cart: orderItems });
        }
        catch (error) {
            return next(new ErrorHandler(error, 401));
        }

    }
);


exports.getCart = async (req, res, next) => {
    const hotelID = req.params.id;
    const userID = req.userID;
    const cart = await cartOrder.find({ userID: userID, hotelID: hotelID });

    if (cart.length == 0) {
        res.status(200).send({ message: "cart not found", items: [] });
    }
    else {
        const orderItems = cart[0]?.orderItems;
        res.status(200).send({ message: "cart found", items: orderItems });
    }
}

    ;


exports.deleteCart = catchAsyncError(async (req, res, next) => {
    const hotelID = req.params.id;
    const userID = req.userID;

    const cart = await cartOrder.findOneAndDelete({ userID: userID, hotelID: hotelID });

    res.status(202).send({ success: true, message: "cart deleted", cart: cart });
})