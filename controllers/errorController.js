const AppError = require('./../utils/appError');
const handleJsonExpiredToken = ()=> new AppError('your token has expired please log in again !',401)
const handleJsonWebTokenError = err=> new AppError('Invalid Token please log in again!', 401)
const handleCastErrorDB = err =>{
  const message =`invalid ${err.path} : ${err.value}.`;
  return err = new AppError(message,400);
}
const handleDuplicateFieldsDB = err =>{
  const value =err.errmsg.match(/(["'])(\\?.)*\1/)[0];
  console.log(value)
  const message =` Duplicate field value ${value} please use another value`;
return err = new AppError(message,400);
}
const handleValidationErrorDB = err =>{
  const erros = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${erros.join('. ')}`;
  return new AppError(message,400)
}
const sendErrorDev =(err,res)=>{
  res.status(err.statusCode).json({
     status: err.status,
     error:err,
     message: err.message,
     stack: err.stack
  })
}
module.exports = (err, req, res, next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if(process.env.NODE_ENV === 'production'){
   
    if (err.name === "CastError"){err = handleCastErrorDB(err)}
    else if(err.code ===11000 ){err =handleDuplicateFieldsDB(err);}
    else if(err.name === "ValidationError"){err = handleValidationErrorDB(err)}
    else if(err.name ==="JsonWebTokenError"){err = handleJsonWebTokenError()}
    else if(err.name ==="TokenExpiredError"){err = handleJsonExpiredToken()}
    else {
      // programming or other unknown error: don't leak error details
      // 1. log error
      console.error("Error🎇", err.name);
      // 2.send generic message
      res.status(500).json({
        status: "error",
        message: "Something went very wrong",
      });}
    if(err.isOperational){
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    }
  }
  else if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,res);
  }
 
  
  // const myError = new AppError("Invalid user input",400);
  // console.log(myError.message);
  // console.log(myError.name);
  // console.log(myError.status);
  // console.log(myError.statusCode);
  // console.log(myError.isOperational);















}
