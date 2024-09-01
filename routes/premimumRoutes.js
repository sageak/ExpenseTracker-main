const express=require('express');
const routes=express.Router();

const orderController=require('../controllers/orderController');
const premimumController=require('../controllers/premimumController');
const userAuth=require('../middleware/auth');

routes.get('/purchase/premimummember',userAuth.authonticate,orderController.purchasePremium);
routes.post('/purchase/updatetransactionstatus',userAuth.authonticate,orderController.updateTransactionStatus);
routes.get('/premimum/showAllExpenses',userAuth.authonticate,premimumController.getAllUserExpense);
routes.get('/daily',userAuth.authonticate,premimumController.daily);
routes.get('/monthly',userAuth.authonticate,premimumController.monthly);
routes.get('/yearly',userAuth.authonticate,premimumController.yearly);
routes.get('/report',premimumController.fileHistoryPage);
routes.get('/fileHistory',userAuth.authonticate,premimumController.fileHistory);
module.exports=routes;