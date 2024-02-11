const mongoose = require("mongoose");

const groupOrderSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  groupId: {
    type: Number,
    required: true,
  },
  groupName: {
    type: String,
    required: false,
  },
  userIds: [
    {
      type: String,
    },
  ],
  cartItems: {
    type: Map,
    of: [
      {
        userId: {
          type: String,
        },
        userName: {
          type: String,
        },
        items: [
          {
            name: {
              type: String,
            },
            price: {
              type: Number,
            },
            quantity: {
              type: Number,
            },
            itemID: {
              type: String,
            },
            imageLink: {
              type: String,
            },
          },
        ],
      },
    ],
  },
});

groupOrderSchema.methods.addItem = function (userId, userName, item) {
  const cartItem = this.cartItems.get(userId);
  if (!cartItem) {
    this.cartItems[userId] = {
      userId: userId,
      userName: userName,
      items: [
        {
          name: item.name,
          price: item.price,
          quantity: 1,
          itemID: item.id,
          imageLink: item.imageLink,
        },
      ],
    };
  } else {
    const existingItem = this.cartItems[userId].items.find(
      (Item) => Item.itemId == item.itemId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems[userId].items.push({
        name: item.name,
        price: item.price,
        quantity: 1,
        itemID: item.id,
        imageLink: item.imageLink,
      });
    }
    this.save();
    return this.cartItems[userId].items;
  }
};

groupOrderSchema.methods.removeItem = function (userId, userName, item) {
  const cartItem = this.cartItems.get(userId);
  if (!cartItem) {
    const index = this.cartItems[userId].items.findIndex(
      (Item) => Item.id === item.id
    );
    if (index !== -1) {
      this.cartItemp[index].items.quantity -= 1;

      if (this.cartItemp[index].items.quantity <= 0) {
        this.cartItemp[index].items.splice(index, 1);
      }
      return this.save();
    }
  }
  return Promise.resolve(this);
};

groupOrderSchema.methods.deleteItem = async (userId, userName, item) => {
  const cartItem = this.cartItem.get(userId);
  if (!cartItem) {
    const index = this.cartItems[userId].items.findIndex(
      (Item) => Item.id === item.id
    );
    if (index !== -1) {
      this.cartItemp[index].items.splice(index, 1);
      return this.save();
    }
  }
  return Promise.resolve(this);
};

groupOrderSchema.methods.deleteCart = async (userId, userName) => {
  const cartItem = this.cartItems.get(userId);
  if(cartItem) {
       this.cartItems.delete(userId) ; 
  }
  return Promise.resolve(this);
};

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

module.exports = mongoose.model("GroupOrder", groupOrderSchema);
