const Product = require('../models/Product')
const {StatusCodes} = require("http-status-codes")
const customError = require('../errors')
const path = require('path')

const createProduct = async (req,res)=>{
    req.body.user = req.User.userId;
    console.log(req.body);
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}
const getAllProducts = async (req,res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length})
}
const getSingleProduct = async (req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findById(productId).populate('reviews')
    if(!product){
        throw new customError.NotFoundError(`No product with product id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}
const updateProduct = async (req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{new:true,runValidators:true})
    if(!product){
        throw new customError.NotFoundError(`No product with product id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}
const deleteProduct = async (req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findById(productId)
    if(!product){
        throw new customError.NotFoundError(`No product with product id: ${productId}`)
    }
    await product.remove()
    res.status(StatusCodes.OK).json({msg:'Product Deleted'})
}
const uploadImage = async (req,res)=>{
    if(!req.files){
        throw new customError.BadRequestError('No file Uploaded')
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith('image')){
        throw new customError.BadRequestError('Please upload image')
    }
    const maxSize = 1024 *1024
    if(productImage.size > maxSize){
        throw new customError.BadRequestError('Please upload image smaller than 1 MB')
    }
    const imagePath = path.join(__dirname,'../public/uploads/'  + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`})
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}