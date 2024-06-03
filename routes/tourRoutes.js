const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes')
const router = express.Router();

//Applying nested routes
//POST /tour/432fds3/reviews
//GET /tour/23ewedwe/reviews
//GET /tour/123wqd/reviews/wd132
// router.route('/:tourId/reviews').post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
// )
router.use('/:tourId/reviews',reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getALLTours)
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan);

router.route('/').get(tourController.getALLTours).post( authController.protect,authController.restrictTo('admin','lead-guide'), tourController.createTour);
router.route('/:id').get(tourController.getTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour).patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.uploadTourImages,tourController.resizeTourImages,tourController.updateTour);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)
// /tours-distance?distance=233&cnter=-40,45&unit=mi
// /
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)
module.exports = router;
