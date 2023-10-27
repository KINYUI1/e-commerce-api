const express = require('express')
const router = express.Router()
const orderCtrl = require('../controllers/orderController')
const authenticationMiddleware = require('../middleware/authentication')
const authorizationMiddleware = require('../middleware/authorized')

router.get('/',authenticationMiddleware,authorizationMiddleware('admin'),orderCtrl.getAllOrders)
router.post('/',authenticationMiddleware,orderCtrl.createOrder)
router.get('/showAllMyOrders',authenticationMiddleware,orderCtrl.getCurrentUserOrders)
router.get('/:id',authenticationMiddleware,orderCtrl.getSingleOrder)
router.patch('/:id',authenticationMiddleware,orderCtrl.updateOrder)

module.exports = router
