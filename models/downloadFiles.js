const Sequelize = require('sequelize');
const sequelize = require("../utils/database");

const downloadedFiles = sequelize.define("downloadedFiles",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    link:{
        type:Sequelize.STRING,
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
})

module.exports = downloadedFiles;