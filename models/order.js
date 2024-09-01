const { Sequelize } = require('sequelize');
const sequelize=require('../utils/database');


const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentid:Sequelize.STRING,
    orderid:Sequelize.STRING,
    status:Sequelize.STRING,
    
})
sequelize.sync();
module.exports=Order;