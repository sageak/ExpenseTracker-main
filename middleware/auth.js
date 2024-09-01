const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authonticate=(req,res,next)=>{
try{
    const token = req.header('Authorization');

if (!token) {
    return res.status(401).send('Access denied. Token not provided.');
}
    console.log(token);
    const user=jwt.verify(token,'98789d2f3jjdhrbfufeu3847646ujfjehffhe83');
    console.log("UserID>>",user.userId);
    User.findByPk(user.userId).then(user=>{
        req.user=user;
        next();
    })
}catch(error){
    console.error(error);
}
};

module.exports={
    authonticate
} 