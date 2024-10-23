const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Product = require("../models/productModel")
const Order = require("../models/orderModel")


// Create new order - any logged  User
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

  
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })


    res.status(201).json({
        success:true,
        order
    })
})

// get Single order - Admin
exports.getSingleOrderDetails = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(new ErrorHandler(`Order not found with this id - ${req.params.id}.`,404))
    }

    res.status(200).json({
        success:true,
        order
    })

}) 

// get loggedIn users order --- any logged  User
exports.getMyOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({
        user:req.user._id  
    })
    if(!orders){
        return next(new ErrorHandler(`Orders not found or no order placed yet.`,404))
    }

    res.status(200).json({
        success:true,
        orders
    })

}) 

// get all users order --- Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find()
    if(!orders){
        return next(new ErrorHandler(`Orders not found or no order placed yet.`,404))
    }

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })

}) 

// Update order  --- Admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler(`Order not found .`,404))
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order .",400))
    }

    // Shipped or Delivered stock should reduce for that products

    order.orderItems.forEach(async(item)=>{
        if(order.orderStatus === "Processing")
            await updateStock(item.product,item.quantity) // quantity & product id
    })

    order.orderStatus = req.body.status
    
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({
        validateBeforeSave:false
    })

    res.status(200).json({
        success:true,
    })

}) 

// Delete order --- admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler(`Order not found .`,404))
    }

    const deletedOrder = await Order.findByIdAndDelete(order._id)

   
    res.status(200).json({
        success:true,
    })

}) 




// Update stock function
async function updateStock(productId,quantity){
    const product = await Product.findById(productId) 
    product.stock -= quantity
    await product.save({
        validateBeforeSave:false
    })
}