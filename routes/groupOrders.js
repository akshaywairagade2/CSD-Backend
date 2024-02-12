const express = require("express");
const {
  createGroup,
  joinGroup,
  addItem,
  removeItem,
  deleteItem,
  deleteCart,
  addCartToGroup,
} = require("./../controllers/groupOrders");

const router = express.Router();

router.post("/createGroup", createGroup);
router.post("/joinGroup", joinGroup);
router.post("/groups/addItem", addItem);
router.post("/groups/removeItem", removeItem);
router.post("/groups/deleteItem", deleteItem);
router.post("/groups/deleteCart", deleteCart);
router.post("/groups/addCartToGroup",addCartToGroup ) ;   




module.exports = router;
