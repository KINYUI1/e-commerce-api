const customError = require('../errors')

const checkPermissions = (reqeustUser,resourceUserId)=>{
if(reqeustUser.role === 'admin')return
if(reqeustUser.userId === resourceUserId.toString()) return
throw new customError.UnauthorizedError('Not authorized to access this route')
}

module.exports = checkPermissions