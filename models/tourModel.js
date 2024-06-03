const mongoose= require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');
const tourSchema = new mongoose.Schema({
    name:{
        type : String,
        required :[true, 'A tour must have a name'],
        unique:true,
        trim : true,
        maxlength:[40, 'the name must be up top 40 characters'] ,
        minlength:[10, 'the name must be at least 10 characters'],
        //validate:[validator.isAlpha,"must be a valid alpha"]
    },
    secretTour:{
        type:Boolean,
        default:false
    },
    duration:{
        type:Number,
        required :[true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required :[true, 'A tour must have a maxGroupSize']
    },
    difficulty:{
        type:String,
        required :[true, 'A tour must have a difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:'difficulty is in  easy or medium or difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'the minimum rating is 1'],
        max:[5,'the maximum rating is 5'],
        set: val => Math.round(val * 10)/10
    },
    ratingsQuantity:{
        type :Number,
        default:0
    },
    rating:{
        type: Number,
        default :4.5,
        min:[1,'the minimum rating is 1'],
        max:[5,'the maximum rating is 5']
    },
    price:{
        type: Number,
        required :[true, 'A tour must have a price']
    },
    priceDiscount: {
         type:Number,
         validate:{
            validator: function(val){
                //this only points to current doc on New document creation
                return val < this.price;
            },
            message:'the price discount ({VALUE}) must be less than the price'
         }
        },
    summary:{
        type: String,
        trim : true,
        required :[true, 'A tour must have a summary']
    },
    description:{
        type: String,
        trim : true,
        required :[true, 'A tour must have a description']
    },
    imageCover:{
        type: String,
        required :[true, 'A tour must have an imageCover']
    },
    images:[String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select:false
    },
    startDates:[Date],
    startLocation:{
        //GeoJSon
        type:{
            type: String,
            default: 'Point',
            enum:['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations:[
        { 
        type:{
            type: String ,
            default : 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number 
    }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

//indexing
//tourSchema.index({price :1})
tourSchema.index({price :1,ratingsAverage : -1})
tourSchema.index({slug:1});
tourSchema.index({startLocation: '2dsphere'})


    tourSchema.virtual('durationweek').get(function(){
        return this.duration /7;
    })
    //virtual populate
    tourSchema.virtual('reviews',{
        ref:'Review',
        foreignField:'tour',
        localField:'_id'

    })
    ///Document middleware : runs before .save() and .create()
    tourSchema.pre('save',function(next){
       this.slug = slugify(this.name,{lower:true})
       next();
    })
    //This code works for embedding user documents into tours document
    // tourSchema.pre('save',async function(next){
    //     const guidesPromises = this.guides.map( async id=> await User.findById(id))
    //     this.guides = await Promise.all(guidesPromises);
    //     next();
    // })

    // tourSchema.pre('save',function(next){
    //     console.log('will save document..')
    //     next();
    // })
    // tourSchema.post('save',function(doc,next){
    //     console.log(doc)
    //     next()
    // })

    //Query Middleware
    // we use this pre save middleware to populate the referenced data from users into tour model
    tourSchema.pre(/^find/, function(next){
        this.populate({
            path: 'guides',
            select : '-__v -passwordChangedAt'
        })
        next()
    })
    tourSchema.pre(/^find/,function(next){
        this.find({secretTour:{$ne: true}})
        this.start=Date.now();
        next()
    })
    tourSchema.post(/^find/,function(docs,next){
        console.log(`query took ${Date.now() - this.start} milliseconds`)
        //console.log(docs)
        next()
    })


    //Aggregation Middleware
    // tourSchema.pre('aggregate', function(next){
    //     this.pipeline().unshift({$match:{secretTour:{$ne: true}}})
    //     console.log(this.pipeline())
    //     next();
    // })
    //A model created from the schema
    const Tour = mongoose.model('Tour', tourSchema);

    ////////////////////////////////
    
    // //create a document from the model
    // const testTour = new Tour({
    //     name: "forrest gump",
    //     price: 500,
    //     //rating:4.4,
    // })
    // testTour.save().then(doc => console.log(doc)).catch(err => console.log("EROOR 🎇",err))
    module.exports = Tour
    
