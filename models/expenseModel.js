const { Sequelize } = require('sequelize');
const sequelize=require('../utils/database');

const Expense=sequelize.define('expenses',{
id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
},
Amount:{
    type:Sequelize.INTEGER,
},
description:{
    type:Sequelize.STRING,
},
category:{
    type:Sequelize.STRING,
},
userId:{
    type: Sequelize.INTEGER,
    allowNull:false,
}
});

module.exports=Expense;