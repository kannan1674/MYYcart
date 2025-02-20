const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../config/config.env') }); 
//const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'STRIPE_SECRET_KEY is not loaded';
const catchAsync = require("../middleware/catchAsync");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsync(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: "accept_payment" },
        shipping: req.body.shipping
    });

    res.status(200).json({
        message: "Success",
        client_secret: paymentIntent.client_secret
    });
});

exports.sendStripeApi = catchAsync(async (req, res, next) => {
    res.status(200).json({
        stripeApikey: process.env.STRIPE_PUBLIC_KEY || 'STRIPE_PUBLIC_KEY is not loaded'
    });
});
