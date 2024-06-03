const { error } = require('console');
const express = require('express');
const AppError = require('./utils/appError');
const golbalErrorHandler = require('./controllers/errorController');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const morgan = require('morgan');
const rateLimit = require('express-rate-Limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
const path = require('path');
//1. Global Middlewares
//set security HTTP headers
app.use(helmet())
//Development logging
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}
//Limit requests from the same API
const limiter = rateLimit({
   max:100  ,
   windowMs:60*60*1000,
   message:'Too many request from this IP, please try again in an hour'
})
app.use('/api',limiter)
//Body parser, reading data from body into req.body
app.use(express.json({limit : '10Kb'}));

//Data sanitization against Nosql query injection
app.use(mongoSanitize())

//Data sanitization against XSS
app.use(xss())
// Prevent parametere pollution
app.use(hpp({
   whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}))
//serving static files
//app.use(express.static(`${__dirname}/public`))

//test middleware
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
})

//3.Routes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);
app.all('*',(req,res,next)=>{
// const err = new Error(`Cant find ${req.originalUrl} on the server`);
// err.status = 'fail';
// err.statusCode = 404;


next(new AppError(`Cant find ${req.originalUrl} on the server`,404));
})
app.use(golbalErrorHandler)
//4.start server
module.exports = app;