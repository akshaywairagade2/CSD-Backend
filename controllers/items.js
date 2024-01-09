const Items = require('../models/items')

exports.addItem = async (req, res) => {
    const {
        name,
        hotelId,
        price,
        imageLink,
        quantity,
        availabilityStatus,
        description,
    } = req.body;
    const rating = 0;
    const reviews = [];
    const item = await Items.create({
        name,
        hotelId,
        price,
        imageLink,
        quantity,
        availabilityStatus,
        description,
        rating,
        reviews
    });

    try {
        return res.status(201).json({
            msg: "Item Added Successfully",
            Item: {
                _id: item.itemId,
            },
        });
    }
    catch {
        return res.status(400).json({ msg: "Unable to Add Item" });
    }
};

exports.getItems = async (req, res) => {

    const { itemId } = req.params;
    if (itemId) {
        Items.findOne({ _id: itemId })
            .exec((error, item) => {
                if (error) return res.status(400).json({ error });
                if (item) {
                    res.status(200).json({ product });
                }
            })
    }
    else {
        return res.status(400).json({ error: 'Params Required' });
    }
};

exports.deleteItem = async (req, res) => {
    const itemId = req.body.itemId;
    try {
        const item = await Items.findOneAndDelete({ itemId: itemId });
        return res.status(200).json({
            msg: "Item Deleted Successfully",

        });
    } catch (err) {
        return res.status(400).json({ msg: "Unable to Delete Item" });
    }
};

exports.updateItem = async (req, res) => {

    const itemId = req.body.itemId;
    const updatedName = req.body.name;
    const updatedhotelId = req.body.hotelId;
    const updatedPrice = req.body.price;
    const updatedImageLink = req.body.imageLink;
    const updatedQuantity = req.body.quantity;
    const updatedAvailabilityStatus = req.body.availabilityStatus;
    const updatedDescription = req.body.description;

    try {
        await Items.findByIdAndUpdate(itemId, {

            name: updatedName,
            hotelId: updatedhotelId,
            price: updatedPrice,
            imageLink: updatedImageLink,
            quantity: updatedQuantity,
            availabilityStatus: updatedAvailabilityStatus,
            description: updatedDescription
        });

        return res.status(200).json({
            msg: "Item Updated Successfully",

        });
    } catch (err) {
        return res.status(400).json({ msg: "Unable to Update Item" });
    }
};