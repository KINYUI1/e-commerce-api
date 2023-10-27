const Review = require('../models/Review')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const {checkPermissions} = require('../utils')

const createReview = async (req,res)=>{
    const {product:productId} = req.body
    const isValidProduct = await Product.findOne({_id:productId})
    if(!isValidProduct){
        throw new customError.NotFoundError(`No product with id ${productId}`)
    }
    const areadySubmitted = await Review.findOne({product:productId,user:req.User.userId})
    if(areadySubmitted){
        throw new customError.BadRequestError('Already submitted review for this product')
    }
    req.body.user = req.User.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}
const getAllReviews = async (req,res)=>{
    const reviews = await Review.find({}).populate({path:'product',select:'name price company'}).populate({path:'user',select:'name role email'})
    res.status(StatusCodes.OK).json({reviews})
}
const getSingleReview = async (req,res)=>{
    const {id:reviewId} = req.params
    const review = await Review.findOne({_id:reviewId}).populate({path:'product',select:'name price company'})
    if(!review){
        throw new customError.NotFoundError(`No review with id: ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}
const updateReview = async (req,res)=>{
    const {id:reviewId} = req.params
    const {rating,title,comment} = req.body
    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new customError.NotFoundError(`No review with id: ${reviewId}`)
    }
    checkPermissions(req.User,review.user)
    review.rating = rating
    review.title = title
    review.comment = comment
    await review.save()
    res.status(StatusCodes.OK).json({review})
}
const deleteReview = async (req,res)=>{
    const {id:reviewId} = req.params
    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new customError.NotFoundError(`No review with id: ${reviewId}`)
    }
    checkPermissions(req.User,review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg:'Review deleted'})
}
const getSingleProductReviews = async (req,res)=>{
    const {id:productId} = req.params
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}