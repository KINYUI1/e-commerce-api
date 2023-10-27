const customError = require('../errors')

const authorizedPermision = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.User.role)){
            throw new customError.UnauthorizedError('Unuathorized to acces this route')
        }
        next()
    }
}

module.exports = authorizedPermision