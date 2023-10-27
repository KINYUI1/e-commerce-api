const express = require('express')
const router = express.Router()
const reviewCtrl = require('../controllers/reviewController')
const authenticationMiddleware = require('../middleware/authentication')


router.get('/',reviewCtrl.getAllReviews)
router.post('/',authenticationMiddleware,reviewCtrl.createReview)
router.get('/:id',reviewCtrl.getSingleReview)
router.patch('/:id',authenticationMiddleware,reviewCtrl.updateReview)
router.delete('/:id',authenticationMiddleware,reviewCtrl.deleteReview)

module.exports = router