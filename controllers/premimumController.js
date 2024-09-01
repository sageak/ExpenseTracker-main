const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const sequelize = require('../utils/database');
const { Op } = require("sequelize");
const S3Services = require("../service/S3services");
const downloadedFiles = require("../models/downloadFiles");


function isstringValidator(string){
    if(string =='undefined' || string.length===0){
        return true;
    }else{
        return false;
    }
}

const getAllUserExpense=async(req,res)=>{
    try{
        const userLeaderBoardDetails=await User.findAll({
            attributes: ['id', 'name','totalExpenses'],

            group:['user.id'],
            order: [[sequelize.col("totalExpenses"), "DESC"]]
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b)=>b.totalExpenses-a.totalExpenses);
        res.status(200).json(userLeaderBoardDetails);
    }catch(error){
        res.status(500).json(error);
        throw new Error(error);
    }

};
const daily = async (req, res) => {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
  
      const expenses = await Expense.findAll({
        where: {
          userId: req.user.id,
          updatedAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["total_cost", "DESC"]],
      });
      res.json(expenses);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "internal server errror" });
    }
  };
  
  const monthly = async (req, res) => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      const expenses = await Expense.findAll({
        where: {
          userId: req.user.id,
          updatedAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        orders: [["total_cost", "DESC"]],
      });
      res.json(expenses);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const yearly = async (req, res) => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 0, 1);
      const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
  
      const expenses = await Expense.findAll({
        where: {
          UserId: req.user.id,
          updatedAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        orders: [["total_cost", "DESC"]],
      });
  
      res.json(expenses);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "internal server error" });
    }
  };
  
  const fileHistoryPage = ((req, res) => {
    res.sendFile(path.join(__dirname,'../','views','report.html'));
  });

  const fileHistory=(async(req,res)=>{
    try{
   const downloadedFile= await downloadedFiles.findAll({ where: { userId: req.user.id } });
   console.log(downloadedFile);
   res.json(downloadedFile);
    }catch(err)
    {
console.log(err);
    }
  })
module.exports={
    getAllUserExpense, daily, monthly, yearly,fileHistoryPage,fileHistory
  }