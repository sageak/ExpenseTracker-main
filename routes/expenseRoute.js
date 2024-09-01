const express=require('express');
const routes=express.Router();

const expenseController=require('../controllers/expenseController');
const userAuth=require('../middleware/auth');

routes.get('/expense',expenseController.expensePage);
routes.post('/addExpense',userAuth.authonticate,expenseController.addExpense);
routes.get('/showExpense',userAuth.authonticate,expenseController.getExpenseList);
routes.delete('/delExpense/:id',userAuth.authonticate,expenseController.delExpense);
routes.get('/reportDownload',userAuth.authonticate, expenseController.downloadedExpense);
routes.get('/expenses/:id',userAuth.authonticate,expenseController.getExpenseById);
routes.put('/expenses/:id',expenseController.updateExpense);
// routes.get('/reportDownload',expenseController.downloadedExpense);
module.exports=routes;