const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/forgetPassword');
const path = require('path');
const sequelize = require('../utils/database');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREV_API_KEY;

const apiInstance = new Sib.TransactionalEmailsApi();

const getForgetPassPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'forgetPass.html'));
};

const getResetPassPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'resetPassword.html'));
};

const forgotPassword = async (req, res) => {
  
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const id = uuid.v4();
            await user.createForgetpassword({ id, active: true });

            const sender = {
                email: 'sidkun123@gmail.com'
            };
            const receiver = [{
                email: email
            }];
            await apiInstance.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'Expense Tracker - Reset Password',
                htmlContent: `Dear user,<br>
                    Please click on the link below to reset your password:<br>
                    <a href="http://localhost:3000/resetpassword/${id}">Reset password</a><br>
                    Thanks & Regards,<br>
                    Expense Tracker Support Team`
            });

            console.log("Email sent");
            return res.status(200).json({ message: 'Link to reset password sent to your email', success: true });
        } else {
            throw new Error('User does not exist');
        }
    } catch (error) {
        console.error('Error in forgotPassword function:', error);
        res.status(500).json({ error: 'Internal Server Issue' });
    }
};

const resetPassword = async (req, res, next) => {
    let t;
    try {
        const { uuid } = req.body;
        const newPassword = req.body.password;

        const forPasswordRequest = await Forgotpassword.findOne({
            where: { id: uuid, active: true },
        });

        if (!forPasswordRequest) {
            return res.status(400).json({ message: "Invalid reset link" });
        }

        const userId = forPasswordRequest.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const saltround = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltround);
        
        t = await sequelize.transaction();
        await User.update(
            { password: hashedPassword },
            { where: { id: userId }, transaction: t }
        );

        await forPasswordRequest.update({ active: false }, { transaction: t });
        await t.commit();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        if (t) await t.rollback();
        console.log("Error in resetPassword route:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getForgetPassPage,
    forgotPassword,
    getResetPassPage,
    resetPassword,
};
