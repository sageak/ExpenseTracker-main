const express = require('express');
const cors = require('cors');
const fs = require('fs');
// const https=require('https');

// Put this before database file access
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./utils/database');
const userRoutes = require('./routes/userRoute');
const premimumRoutes = require('./routes/premimumRoutes');
const expenseRoutes = require('./routes/expenseRoute');
const forgetPassRoutes = require('./routes/forgetpassword');
const path = require('path');
const User = require('./models/user');
const Expense = require('./models/expenseModel');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgetPassword');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const morgan = require('morgan');
const { Certificate } = require('crypto');
const app = express();
const PORT = 3000;

// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert')
app.use(express.static(path.join(__dirname, 'public')));


app.use(morgan('', { stream: accessLogStream }));
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(userRoutes);
app.use(premimumRoutes);
app.use(expenseRoutes);
app.use(forgetPassRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync({ alter: true }).then(() => {
    // https.createServer({ key: privateKey, cert: certificate }, app).listen(PORT, () => { 
    //     console.log(`server is running on https://http://3.25.90.61:${PORT}`);
    // });
    app.listen(PORT, 'localhost', () => { 
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
