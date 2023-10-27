const express = require('express')
const router = express.Router()
const productCtrl = require('../controllers/productController')
const authenticationMiddleware = require('../middleware/authentication')
const authorizedMiddleware = require('../middleware/authorized')
const {getSingleProductReviews} = require('../controllers/reviewController')

router.post('/',authenticationMiddleware,authorizedMiddleware('admin'),productCtrl.createProduct)
router.get('/',productCtrl.getAllProducts)
router.post('/uploadImage',authenticationMiddleware,authorizedMiddleware('admin'),productCtrl.uploadImage)
router.get('/:id',productCtrl.getSingleProduct)
router.patch('/:id',authenticationMiddleware,authorizedMiddleware('admin'),productCtrl.updateProduct)
router.delete('/:id',authenticationMiddleware,authorizedMiddleware('admin'),productCtrl.deleteProduct)
router.get('/:id/reviews',getSingleProductReviews)

module.exports = router