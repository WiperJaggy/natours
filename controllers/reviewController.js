const Review = require('./../models/reviewModel')
const Tour = require("../models/tourModel");
const AppError = require('./../utils/appError')
//const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')

exports.deleteReview = factory.deleteOne(Review);



exports.setTourUserIds = async (req,res,next)=>{
   //Allow nested routes
   if(!req.body.tour) req.body.tour = req.params.tourId;
   if(!req.body.user) req.body.user = req.user.id;
   const tour = await Tour.findById(req.body.tour || req.params.tourId)
   if(!tour){
       return next(new AppError('There is no tour with that ID',404))
   }
   next()
}
exports.getreview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.getAllReviews = factory.getALL(Review)