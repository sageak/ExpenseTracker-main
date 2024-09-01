const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const sequelize = require('../utils/database');
const downloadedFiles = require("../models/downloadFiles");
const S3Services = require("../service/S3services");


const expensePage=(req,res)=>{
 res.sendFile(path.join(__dirname,'../','views','index.html'));
};

function isstringValidator(string){
    if(string =='undefine' || string.length===0){
        return true;
    }else{
        return false;
    }
}

const addExpense= async(req,res)=>{
    try{
        const t=await sequelize.transaction();
        const Amount = req.body.Amount;
        const userId=req.user.id;
        const description = req.body.description;
        const category=req.body.category;
        await Expense.create({Amount,description,category,userId},{transaction:t}).then(async(expense)=>{
        const totalExpense=Number(req.user.totalExpenses)+Number(Amount);
        console.log(totalExpense);
        await User.update({
            totalExpenses:totalExpense
        },{
            where:{id:req.user.id},
            transaction:t
       }).then(async()=>{
        await t.commit();
        res.status(200).json({expense:expense});
       }) 
       }).catch(async(err)=>{
         await t.rollback();
        res.status(402).json('Not Found');
       })
    }catch(error){
     await t.rollback();
        console.error(error);
        res.status(500).json('internal server issue');
    }
};
const getExpenseList= async(req,res)=>{
    try {
        const userId = req.user.id;
        const page = req.query.page || 1;
        const pageSize = 5;
        const { count, rows } = await Expense.findAndCountAll({
          where: { userId: userId },
          attributes: ["id", "description", "category", "Amount"],
          limit: pageSize,
          offset: (page - 1) * pageSize,
        });
        const totalPAges = Math.ceil(count / pageSize);
        res.json({
          totalItems: count,
          totalPAges: totalPAges,
          currentPages: page,
          expenses: rows,
        });
      } catch (error) {
        console.log("error occured while fethcing data", error);
        res.status(500).json({ error: " no data available or server not working" });
      }

}

const delExpense = async (req, res) => {
    const expenseId=req.params.id;
    try {
        const t=await sequelize.transaction();
        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not Found' });
        }
        const totalExpense = Number(req.user.totalExpenses) - Number(expense.Amount);
        
        await Expense.destroy({ where: { id: expenseId, userId: req.user.id } },{transaction:t}).then(async()=>{
        
        await User.update({ totalExpenses: totalExpense }, 
            { 
                where: { id: req.user.id },
                transaction:t
            }).then(async()=>{
                await t.commit();
                res.status(201).json({ message: 'Expense deleted successfully' });
            }).catch(async(error)=>{
                await t.rollback();
                res.status(404).json({ error: 'not found' });
            })
        })
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const downloadedExpense = async (req, res) => {
  try {
      const userId = req.user.id;
      let expense = await Expense.findAll({ where: { userId: userId } });
      const stringifiedExpenses = JSON.stringify(expense);
      const filename = `Expenses${userId}/${new Date()}.txt`;
      // console.log("Stringified expenses:", filename); 
      const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
      // console.log("Uploaded to S3. File URL:", fileURL);

      if (!fileURL) {
          throw new Error("File URL is undefined");
      }

      const downloadfiles = await downloadedFiles.create({
          link: fileURL,
          userId: userId,
      });
      // res.redirect(fileURL);
       res.status(200).json({ fileURL, success: true });
  } catch (err) {
      console.error("Error in downloadedExpense:", err);
      res.status(500).json({ message: "Something went wrong", err: err.message });
  }
};

  const getExpenseById = async (req, res) => {
    const expenseId = req.params.id;
    try {
      const row = await Expense.findOne({ where: { id: expenseId } });
      if (!row) {
        return res.status(404).json({ error: "Expense Not Found" });
      }
      res.json(row);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ Error: "Internal Server Error while fetching a user." });
    }
  };
  const updateExpense=async(req,res)=>{
    let t;
    // console.log("update details",req.body);
    const { description, Amount, category ,userId, expenseId} = req.body;
    try {
      t = await sequelize.transaction();
      
      const rowUpdated = await Expense.update(
        { description, category, Amount },
        { where: { id: expenseId,userId: userId }, returning: true, transaction: t }
      );
      
      const updatedExpense = await Expense.findByPk(expenseId);
  
      if (rowUpdated === 0) {
        await t.rollback();
        return res.status(404).json("Error: Expsnse not found")
      }
  
      const diffAmount = Amount - updatedExpense.Amount;
      console.log(diffAmount);
      await User.update(
        { totalExpenses: sequelize.literal(`totalExpenses + ${diffAmount}`) },
        { where: { id: userId }, transaction: t }
      );
      await t.commit();
  
      res.json(updatedExpense);
    } catch (error) {
      if (t) {
        await t.rollback();
      }
      console.error("error updating expense:", error);
      res.status(500).json({
        error: "An error occurred while updating the user.",
      });
    }
  };
module.exports={
    expensePage,
    addExpense,
    getExpenseList,
    delExpense,
    downloadedExpense,
    updateExpense,
    getExpenseById
}