const express=require('express');
const routes=express.Router();
const forgetpassController=require('../controllers/forgetPassController');
const { route } = require('./userRoute');

routes.get('/forgetPassPage',forgetpassController.getForgetPassPage);

routes.post('/forgotPassword',forgetpassController.forgotPassword);

routes.get('/resetpassword/:uuid',forgetpassController.getResetPassPage);

routes.post('/resetpassword',forgetpassController.resetPassword);

//routes.post('/newPassword',forgetpassController.newPassword);

module.exports=routes;
