const Order = require('../model/orderModel')
const Product = require('../model/productModel')
const AsyncError = require('../middleware/catchAsync')
const ErrorHandler = require('../utils/errorHandler')


//Create New Order
exports.createOrder = AsyncError(async (req, res, next) => {
    try {
        const {

            orderItems,
            shippingInfo,
            taxPrice,
            itemPrice,
            shippingPrice,
            totalPrice,
            paymentInfo

        } = req.body

        const order = await Order.create({
            orderItems,
            shippingInfo,
            taxPrice,
            itemPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user.id
        })
        res.status(201).json({
            status: "Success",
            order
        })
    } catch (error) {
        next(error)

    }
})

//Get Single Order
exports.singleOrder = AsyncError(async (req, res, next) => {
    try {
        // Fetch order and populate related user data
        const order = await Order.findById(req.params.id).populate('user', 'email name')

        // Check if order exists
        if (!order) {
            return next(new ErrorHandler(`Order not found with ID: ${req.params.id}`, 404));
        }

        // Send successful response
        res.status(200).json({
            status: "success",
            order,
        });
    } catch (error) {
        next(error); // Pass any errors to the middleware
    }
});

//Get My Order
exports.getMyOrder = AsyncError(async (req, res, next) => {
    try {

        const myOrders = await Order.find({ user: req.user.id })

        // Send successful response
        res.status(200).json({
            status: "success",
            count: myOrders.length,
            myOrders,
        });
    } catch (error) {
        next(error);
    }
});

//Admin - Get All Orders
exports.getAllOrders = AsyncError(async (req, res, next) => {
    try {

        const allOrders = await Order.find();
        let totalAmount = 0;

        allOrders.forEach(allOrder => { totalAmount += allOrder.totalPrice })

        // Send successful response
        res.status(200).json({
            status: "success",
            count: allOrders.length,
            TotalAmount:totalAmount,
            allOrders,
        });
    } catch (error) {
        next(error);
    }
});

//Admin - Update Order Status & Status
exports.updateOrders = AsyncError(async(req,res,next)=>{
    try {
        const orders = await Order.findById(req.params.id);

        if(orders.orderStatus == 'Delivered'){
            return next (new ErrorHandler('Order Already Delivered',400))
        }

       orders.orderItems.forEach(async orderItem=>{
            await UpdateStock(orderItem.product,orderItem.quantity)
        })

         orders.orderStatus = req.body.orderStatus;
         orders.deliveredAt = Date.now();
         orders.save();

         res.status(200).json({
            status:"success",
            orders
         })


    } catch (error) {
        next(Error)
        
    }
})
//Update Stock Function
async function UpdateStock(productId,quantity){

    const product = await Product.findById(productId)
    product.stock = product.stock - quantity
    product.save({validateBeforeSave:false})

}

//Admin - Delete Order
exports.deleteOrder = AsyncError(async(req,res,next)=>{
    try {
       let order =  await Order.findById(req.params.id)
       if(!order){
        return next(new ErrorHandler(`Order not found with ID: ${req.params.id}`, 404));
       }

       order = await Order.findByIdAndDelete(req.params.id)

       res.status(200).json({
        status:"Success",
        Message:"Order Deleted Successfully"
       })
    } catch (error) {
        next(error)
        
    }
})


