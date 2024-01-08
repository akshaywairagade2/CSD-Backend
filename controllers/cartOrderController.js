const cartOrder = require('../models/cartOrders');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const user = require('../models/user');
const mongoose = require('mongoose');


exports.addToCart = catchAsyncError(
    async (req, res, next) => {
        try {
            const { hotelID, item } = req.body;
            const userID = req.userID;

            console.log(hotelID, item, "huihui")

            const cart = await cartOrder.findOne({ userID: userID, hotelID: hotelID });
            if (!cart) {
                await cartOrder.create({
                    userID: userID,
                    hotelID: hotelID,
                    orderItems: [],
                })
            }
            console.log("here")
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
        if (!cart) {
            await cartOrder.create({
                userID: userID,
                hotelID: hotelID,
                orderItems: [],
            })
        }
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

    const orderItems = cart[0].orderItems;
    if (!cart) {
        res.status(200).send({ message: "cart not found", cart: [] });
    }
    else {
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