const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const Forgetpassword=sequelize.define('forgetpassword',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    active:Sequelize.BOOLEAN,

});

module.exports=Forgetpassword;