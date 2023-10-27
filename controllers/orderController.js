const Order = require('../models/Order')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const {checkPermissions} = require('../utils')

const fakeStripeApi = async ({amount,currency})=>{
    const client_secret = 'someRandomValue'
    return {client_secret,amount}
}

const createOrder =async (req,res)=>{
    const {items:cartItems,tax,shippingFee} = req.body
    if(!cartItems || cartItems.length < 1){
        throw new customError.BadRequestError('No cart items provided')
    }
    if(!tax || !shippingFee){
        throw new customError.BadRequestError('Please provide tax and shipping fee')
    }
    let orderItems = [];
    let subtotal = 0;
    for(let item of cartItems){
        const dbproduct = await Product.findOne({_id:item.product})
        if(!dbproduct){
            throw new customError.NotFoundError(`No product with id: ${item.product}`)
        }
        const {name,price,image,_id} = dbproduct;
        const singleOrderItem = {
            amount:item.amount,
            name,price,image,product:_id
        }
        orderItems = [...orderItems,singleOrderItem]
        // clsculat subtotal
        subtotal += item.amount * price;
    }
    // calculate total
    const total = tax + subtotal + shippingFee

    // get cient secret
    const paymentIntent = await  fakeStripeApi({
        amount:total,currency:'usd'
    })
    const order = await Order.create({
        orderItems,total,subtotal,tax,shippingFee,clientSecret:paymentIntent.client_secret,user:req.User.userId
    })
    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret})
  }
const getAllOrders = async (req,res)=> {
    const orders =await Order.find({})
    res.status(StatusCodes.OK).json({orders})
  }

  const getSingleOrder = async (req,res)=>{
    const {id:orderId} = req.params
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new customError.NotFoundError(`No order with id: ${orderId}`)
    }
    checkPermissions(req.User,order.user)
    res.status(StatusCodes.OK).json({order})
  }
  const getCurrentUserOrders = async (req,res)=>{
    const orders = await Order.find({user:req.User.userId})
    if(!orders){
        throw new customError.NotFoundError(`No orders for this current user`)
    }
    res.status(StatusCodes.OK).json({orders})
  }
  const updateOrder = async (req,res)=>{
    const {id:orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new customError.NotFoundError(`No order with id: ${orderId}`)
    }
    checkPermissions(req.User,order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
  }

  module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
  }