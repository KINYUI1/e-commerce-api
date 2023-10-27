const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const {BadRequestError,UnauthenticatedError} = require('../errors')
const {attachCookiesToResponce,createTokenUser} = require('../utils')


const registerUser = async (req,res)=>{
    const {name,email,password} = req.body
    const userCheck = await User.findOne({email})
    if(userCheck){
        throw new BadRequestError('Email already in use')
    }
    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount? 'admin':'user'
    const user = await User.create({name,email,password,role})
    const userData = createTokenUser(user)
   attachCookiesToResponce(res,userData)
    res.status(StatusCodes.CREATED).json({user:userData})
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide all credencials')
    }
    const user = await User.findOne({email})
    if(!user){
       throw new UnauthenticatedError(`No user with email ${email}`)
    }
    const checkPassword = await user.comparePassword(password)
    console.log(checkPassword);
    if(!checkPassword){
      throw new UnauthenticatedError('Invalid credencials')
    }
    const userData = createTokenUser(user)
    attachCookiesToResponce(res,userData)
    res.status(StatusCodes.OK).json({user:userData})
}

const logoutUser = async (req,res)=>{
   res.cookie('token','',{
    expires:new Date(Date.now()),
    httpOnly:true
   })
   res.status(StatusCodes.OK).json({msg:'Loged out'})
}

module.exports = {registerUser,loginUser,logoutUser}