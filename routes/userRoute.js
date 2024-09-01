const express=require('express');
const routes=express.Router();

const userController=require('../controllers/userController');

routes.get('/',userController.getIndex);
routes.get('/Img',userController.getImg);
routes.get('/login',userController.getLogin);
routes.get('/Signup',userController.getSignup);
routes.post('/Signup',userController.postSignup);
routes.post('/Login',userController.postLogin);

module.exports=routes;