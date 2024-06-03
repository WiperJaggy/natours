const express = require('express');
const authController = require('./../controllers/authController')
const userController = require('../controllers/userController');
const router = express.Router();



router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
//protect all the routs after this middleware
router.use(authController.protect)

router.patch('/updateMyPassword' , authController.updatePassword);
router.patch('/updateMe' ,userController.uploadUserPhoto,userController.resizeUserPhoto, userController.updateMe);

router.delete('/deleteMe' , userController.deleteMe)

router.use(authController.restrictTo('admin'))

router.route('/').get(userController.getALLUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser);
module.exports = router;