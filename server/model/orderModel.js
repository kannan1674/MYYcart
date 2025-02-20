const mongoose = require('mongoose');

const orderSchema =new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        phoneNo: { type: Number, required: true },
        postalCode: { type: Number, required: true },
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true }, 
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
        },
    ],
    itemPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    paymentInfo: {
        id: { type: String, required: true },
        status: { type: String, required: true },
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    createdAt: { type: Date, default: Date.now },
});

const Orders = mongoose.model("Order", orderSchema);

module.exports = Orders;
