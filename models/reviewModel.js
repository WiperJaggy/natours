const mongoose = require('mongoose');
const Tour = require('./tourModel')
const reviewSchema = new mongoose.Schema({
review :{
    type: String,
    required :[true, 'review cannot be empty']
},
rating:{
    type: Number,
    min :1,
    max:5 
    //required :[true, 'A tour must have a rating']
},
createdAt :{
    type: Date,
    default: Date.now()
},
tour:{
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true,'a review muste belong to a tour']
},
user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'Review must belong to a user']
}
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.index({tour:1,user :1},{unique:true})

reviewSchema.pre(/^find/,function (next){
    // this.populate({
    //     path:'tour',
    //     select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // })
    this.populate({
        path:'user',    
        select:'name photo'
    })
    next();
})
//statistics function  makes it like we deal with the Model
reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating : {$sum :1},
                avgRatings :{$avg: '$rating'}
            }
        }
    ])
    console.log(stats)


    if(stats.length > 0){
    await Tour.findByIdAndUpdate(tourId,{
        ratingsQuantity:stats[0].nRating,
        ratingsAverage:stats[0].avgRatings
    })
}else{
    await Tour.findByIdAndUpdate(tourId,{
        ratingsQuantity:0,
        ratingsAverage: 4.5
    })
}
}
reviewSchema.post('save', function(){
    //this points to current review
    this.constructor.calcAverageRatings(this.tour);
})

//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    console.log(this.r);
    next();
})
reviewSchema.post(/^findOneAnd/,async function(){
    //await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
})
const Review = mongoose.model('Review',reviewSchema);
module.exports = Review