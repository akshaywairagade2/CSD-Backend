const express = require("express");
const {
  createGroup,
  joinGroup,
  fetchGroup,
  addItem,
  removeItem,
  deleteItem,
  deleteCart,
  addCartToGroup,
  placeGroupOrder,
  acceptGroupOrder,
  rejectGroupOrder,
  deliverGroupOrder,
  getGroupOrderByUser,
  getGroupOrderByHotel,
  getGroupByUser
} = require("./../controllers/groupOrders");

const router = express.Router();

router.post("/createGroup", createGroup);
router.post("/joinGroup", joinGroup);
router.post("/fetchgroup", fetchGroup);
router.post("/groups/addItem", addItem);
router.post("/groups/removeItem", removeItem);
router.post("/groups/deleteItem", deleteItem);
router.post("/groups/deleteCart", deleteCart);
router.post("/groups/addCartToGroup", addCartToGroup);
router.post("/placeGroupOrder", placeGroupOrder);
router.post("/acceptGroupOrder", acceptGroupOrder);
router.post("/rejectGroupOrder", rejectGroupOrder);
router.post("/deliverGroupOrder", deliverGroupOrder);
router.post("/getusergrouporders", getGroupOrderByUser);
router.post("/getgroupbyuser", getGroupByUser);
router.post("/gethotelgrouporders", getGroupOrderByHotel);



module.exports = router;
