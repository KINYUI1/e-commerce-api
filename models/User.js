const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please Provide a Name"],
    maxlength:50,
    minlength:3
},
email:{
    type:String,
    required:[true,"Please Provide a Valid Email"],
    validate:{
        validator: validator.isEmail,
        message:'Please Provide a Valid Email'
    },
    unique:true
},
password:{
    type:String,
    required:[true,"Please Provide a Password"],
    minlength:6
},
role:{
    type:String,
    enum:['admin','user'],
    default:'user'
}
})

UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    const match = await bcrypt.compare(candidatePassword,this.password)
    return match
}

module.exports = mongoose.model('User',UserSchema)