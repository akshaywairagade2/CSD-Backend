const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        // ref: 'User',
        required: true
    },
    hotelId: {
        type: String,
        // ref: 'User',
        required: true,
    },
    cartItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
            item: {
                type: String,
                // ref: "Item",
                required: true,
            }
        }
    ],
    orderAcceptOrDecline: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Orders' , orderSchema) ; 