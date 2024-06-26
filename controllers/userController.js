const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError')
const factory =require('./handlerFactory')
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage= multer.diskStorage({
//    destination:(req,file,cb)=>{
//       cb(null, 'dev-data/img/users');
//    },
//    filename: (req,file,cb)=>{
//       const ext = file.mimetype.split('/')[1];
//       cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//    }
// })
const multerStorage = multer.memoryStorage();
const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
     cb(null,true);
     }else{
        cb(new AppError('Not an image! Please upload only images.', 400), false);
   
  }
}

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter
})
exports.uploadUserPhoto= upload.single('photo');
exports.resizeUserPhoto = catchAsync(async(req,res,next)=>{
  if(!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
await  sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality : 90}).toFile(`dev-data/img/users/${req.file.filename}`);
  next();
})
const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   Object.keys(obj).forEach(el => {
     if (allowedFields.includes(el)) newObj[el] = obj[el];
   });
   return newObj;
 };
exports.updateMe = catchAsync(async (req,res,next) =>{
//1.crete  Error if posts password data
if(req.body.password ||req.body.passwordConfirm){
   return next (new AppError("this route is not for password update please use /updateMyPssword.",400))
} 
//2.filtered out unwanted fields  names that are not allowed to be updated
const filteredBody = filterObj(req.body , 'name','email');
if(req.file) filteredBody.photo = req.file.filename;
//3.update user document
const updatedUser = await User.findByIdAndUpdate(req.user.id ,filteredBody,{
  new: true,
   runValidators: true
})
res.status(200).json({
   status : 'success',
   data:{
      user : updatedUser
   }
})
})


exports.deleteMe = catchAsync(async (req,res,next) => {
   await User.findByIdAndUpdate(req.user.id , {active : false})      
   res.status(204).json({
      status : 'success',
      data:null
   })
})


exports.getALLUsers = factory.getALL(User)
exports.deleteUser = factory.deleteOne(User);
///Do NOT use this to update passwordss
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
   console.log(req.requestTime);
   res.status(500).json({
      status: 'error',
      message: 'this resource is not defined yet.. please use /signUp'
   })
}