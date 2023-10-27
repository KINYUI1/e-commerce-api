const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const customError = require('../errors')
const {attachCookiesToResponce,createTokenUser,checkPermissions} = require('../utils')


const getAllUsers = async (req,res) =>{
    const users = await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getSingleUser =async (req,res) =>{
    const {id:userId} = req.params
    const user = await User.findOne({_id:userId}).select('-password')
    if(!user){
        throw new customError.NotFoundError(`No user with id ${userId}`)
    }
    checkPermissions(req.User,user._id)
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = (req,res) =>{
    res.status(StatusCodes.OK).json({user:req.User})
}
const updateUser = async (req,res) =>{
    const {name,email} = req.body
    if(!name || !email){
        throw new customError.BadRequestError('Please Provide All Credencials')
    }
    const user = await User.findOneAndUpdate({_id:req.User.userId},{name,email},{new:true,runValidators:true})
    attachCookiesToResponce(res,createTokenUser(user))
    res.status(StatusCodes.OK).json({msg:'update user',user})
}
const updateUserPassword = async (req,res) =>{
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new customError.BadRequestError("Pleace Provide Old and New Password")
    }
    const id = req.User.userId
    const user = await User.findById(id)
    const comparePassword = await user.comparePassword(oldPassword)
    if(!comparePassword){
        throw new customError.UnauthorizedError("Invalid credencials")
    }
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg:'update user password'})
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
