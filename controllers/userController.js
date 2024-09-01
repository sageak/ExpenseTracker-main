const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const sequelize = require('../utils/database');

const getIndex=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','welcome.html'));
};
//
const getImg=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','preview.jpg'));
};
const getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'));
};

const getSignup=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','Signup.html'));
};

function generateToken(id,name,ispremiumuser){
    return jwt.sign({userId:id, name:name, ispremiumuser},process.env.TOKEN);
}
function isstringValidator(string){
    if(string =='undefine' || string.length===0){
        return true;
    }else{
        return false;
    }
}
const postSignup= async(req,res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password=req.body.password;
        if(isstringValidator(name) || isstringValidator(email) || isstringValidator(password)){
            return res.status(400).json({err:'bad Paramets. Something is missing'})
        }
        const saltround=10;
        bcrypt.hash(password,saltround,async(err,hash)=>{
             console.log(err);
             await User.create({name,email,password:hash})
             .then((result)=>{
                console.log(result);
                console.log('Signup Successful');
                  res.status(201).json(result);
            })       
        })

    }catch(err){
        console.log(err);
    } 
};

const postLogin=async(req,res)=>{
   const { email,password}=req.body;
  try{
   const user= await User.findOne({ where:{email} })
//    console.log("User details",user);
   if(!user){
    res.status(401).json({error: 'User not Exist'});
   }
   else{
   const passwordMatched=await bcrypt.compare(password,user.password);

        if(passwordMatched){
           return res.status(200).json({message:'login Sucessful',token: generateToken(user.id,user.name,user.ispremiumuser)});
        //    res.redirect('/expense');
        }else{
            res.status(401).json({error:'Password does not matched'});
        }
    }
   }
  catch(error){
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});

  }
};
const getAllUserExpense=async(req,res)=>{
    try{
        const userLeaderBoardDetails=await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('coalesce',sequelize.fn('sum', sequelize.col('expenses.Amount')),0), 'totalCost']],
            include:[
                {
                    model:Expense,
                    attributes:[],
                }
            ],
            group:['user.id'],
            order: [[sequelize.col("totalCost"), "DESC"]]
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b)=>b.totalCost-a.totalCost);
        res.status(200).json(userLeaderBoardDetails);
    }catch(error){
        res.status(500).json(error);
        throw new Error(error);
    }

};

module.exports={
    getIndex,
    getLogin,
    getImg,
    getSignup,
    postSignup,
    postLogin,
    generateToken,
    getAllUserExpense,
  }