const express = require('express')
const router = express.Router()
const authorizationPermision = require('../middleware/authorized')
const userCtrl = require('../controllers/userController')

router.get('/',authorizationPermision('admin','owner'),userCtrl.getAllUsers)
router.get('/showMe',userCtrl.showCurrentUser)
router.patch('/updateUser',userCtrl.updateUser)
router.patch('/updateUserPassword',userCtrl.updateUserPassword)
router.get('/:id',authorizationPermision('admin','owner'),userCtrl.getSingleUser)

module.exports = router