const customError = require('../errors')
const utils = require('../utils')
const authenticationUser = async (req,res,next)=>{
    const token = req.signedCookies
    if(!token){
        throw new customError.UnauthenticatedError('Authentication Invalid')
    }
    try {
        const user = utils.verifyToken(token)
        req.User = user
        next()
    } catch (error) {
        throw new customError.UnauthenticatedError('Authentication Invalid')
    }
}

module.exports = authenticationUser