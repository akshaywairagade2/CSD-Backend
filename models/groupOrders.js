const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema(
    {
        adminID: {
            type: String,
            required: true,
        },
        hotelID: {
            type: String,
            required: true,
        },
        groupNumber: {
            type: Number,
            required: true,
        },
        userIds :[{
            type: String,
        }],
        cartItems: {
            type: Map,
            of: [{
                userId: {
                    type: String,
                },
                userName: {
                    type: String,
                    required: true,
                },
                items: [{
                    name: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    itemID: {
                        type: String,
                        required: true,
                    },
                    imageLink: {
                        type: String,
                        required: false,
                    },
                }],
            }],
        },
    }

);

// Example usage:
// const GroupOrder = mongoose.model('GroupOrder', groupOrderSchema);
// const order = new GroupOrder({
//     adminID: "admin123",
//     hotelID: "hotel456",
//     groupNumber: 1,
//     userIds: ["user123"],
//     cartItems: new Map(),
// });

// // Adding cart items for a specific user
// const userId = "user123";
// const userName = "John Doe";
// const cartItemsForUser = [{
//     name: "Item1",
//     price: 10,
//     quantity: 2,
//     itemID: "item123",
//     imageLink: "imageurl",
// }];

// order.cartItems.set(userId, { userId, userName, items: cartItemsForUser });

// // Save the order
// order.save(function (err) {
//     if (err) return console.error(err);
//     console.log("Order saved successfully!");
// });

module.exports = mongoose.model('GroupOrder', groupOrderSchema); 