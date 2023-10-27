const jwt = require('jsonwebtoken')

const createToken = ({payload})=>{
const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFE})
return token
}

const verifyToken = ({token}) =>{
 const verified = jwt.verify(token,process.env.JWT_SECRET);
 return verified
}

const attachCookiesToResponce = (res,payload)=>{
const token = createToken({payload});
const oneday = 1000 * 60 * 60 * 24
res.cookie('token',token,{
    httpOnly:true,
    expires:new Date(Date.now() + oneday),
    secure:process.env.NODE_ENV === 'production',
    signed:true
})
}
module.exports = {createToken,verifyToken,attachCookiesToResponce}