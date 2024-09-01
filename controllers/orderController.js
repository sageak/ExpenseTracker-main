const Order = require('../models/order');
const Razorpay = require('razorpay');
const userController=require('./userController');
const dotenv = require('dotenv');
dotenv.config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
const purchasePremium = async (req, res) => {
        console.log("get axios premimum:"+razorpay.key_id);
        const orderOptions = {
            amount: 2500, 
            currency: 'INR',
          };
          razorpay.orders.create(orderOptions, (err, order) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Failed to create Razorpay order', error: err });
            } else {
             req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(()=>{
              console.log("get axios order premimum:"+order.id);
                res.status(201).json({ order_id:order.id, key_id: razorpay.key_id });
             }).catch(err=>{
                throw new Error(err);
             })                    
            } 
          });
};

const updateTransactionStatus =async(req, res) => {

    try {
      const userId=req.user.id;
      const userName=req.user.name;
      console.log("username in update transaction:"+ req.body.payment_id);
      
        const { payment_id, order_id } = req.body;
      const order=await Order.findOne({ where: { orderid: order_id } })
     const promise1=order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
     const promise2=req.user.update({ispremiumuser:true})
     
     Promise.all([promise1,promise2]).then(()=>{
                const token=userController.generateToken(userId,userName,true);
                return res.status(202).json({success:true,message:'Transaction Sucessfull', token : token});
            }).catch(err=>console.log(err));
    } catch (error) {
        console.error(error);
        res.status(403).json({ success: false, message: 'Something went wrong', error });
    }
};
module.exports = {
    purchasePremium,
    updateTransactionStatus
};
