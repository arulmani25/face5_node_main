const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');

const User = require('../Models/UserModel');
const ObjectId = mongoose.Types.ObjectId;

const bcrypt = require('bcryptjs');
const { VerifyToken, GenerateToken } = require('../Helpers/JWSToken');
const { checkPassword } = require('../Helpers');
const { sendMailNotification } = require('../Helpers/mailservice');

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

Router.post('/createUser', async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Required fields are missing',
                Data: {},
                Code: 400
            });
        }

        const existingUsername = await User.findOne({
            username: req.body.username
        });
        if (existingUsername) {
            return res.status(409).json({
                Status: 'Failed',
                Message: 'Username already exists',
                Data: {},
                Code: 409
            });
        }

        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({
                Status: 'Failed',
                Message: 'Email already exists',
                Data: {},
                Code: 409
            });
        }
        const hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword;
        console.log('========req.body.password', req.body.password);
        const newUser = await User.create(req.body);
        return res.status(200).json({
            Status: 'Success',
            Message: 'User created successfully',
            Data: newUser,
            Code: 200
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/getUsers', VerifyToken, async (req, res) => {
    try {
        const users = await User.find().populate('userType');
        return res.status(200).json({
            Status: 'Success',
            Message: 'Users retrieved successfully',
            Data: users,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/users/:id', VerifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('userType');
        if (!user) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'User retrieved successfully',
            Data: user,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.put('/users/:id', VerifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }); // Return updated document
        if (!updatedUser) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User not found',
                Data: {},
                Code: 404
            });
        }

        if (req.body.password) {
            req.body.password = hashPassword(req.body.password);
        }

        return res.status(200).json({
            Status: 'Success',
            Message: 'User updated successfully',
            Data: updatedUser,
            Code: 200
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.delete('/users/:id', VerifyToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'User deleted successfully',
            Data: deletedUser,
            Code: 200
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.post('/login/?:fcm', async (req, res) => {
    try {
        const fcm_token = req?.params?.fcm
        const user = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.username }]
        }).populate('userType', 'name');
        if (!user) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User not found',
                Data: {},
                Code: 404
            });
        }
        const getDbPassword = await User.findOne({
            $or: [{ username: req?.body?.username }, { email: req?.body?.username }]
        });
        const isValidPassword = await checkPassword(req.body.password, getDbPassword.password);
        if (!isValidPassword) {
            return res.status(401).json({
                Status: 'Failed',
                Message: 'Incorrect Password',
                Data: {},
                Code: 401
            });
        }
        const token = await GenerateToken({
            user_id: String(user._id),
            user_type: user.userType
        });

        // Correctly assign the fcm_token to the user document
        if (fcm_token) {
            user.fcm_token = fcm_token;
            user.markModified('fcm_token');
        }

        let result = await user.save();

        result['_doc'].token = token;
        delete result['_doc'].password;

        return res.status(200).json({
            Status: 'Success',
            Message: 'User logged in successfully',
            Data: result,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.post('/updatepassword', VerifyToken, async (req, res) => {
    try {
        if (req.body.oldPassword === req.body.newPassword) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Looks Similar To Previous Password',
                Data: {},
                Code: 404
            });
        }
        const user = await User.findById(req.body.id);
        if (!user) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User not found',
                Data: {},
                Code: 404
            });
        }
        const isValidPassword = await checkPassword(req.body.oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                Status: 'Failed',
                Message: 'Incorrect Old Password',
                Data: {},
                Code: 401
            });
        }
        const hashedPassword = await hashPassword(req.body.newPassword);

        const updateNewPassword = await User.findOneAndUpdate(
            {
                _id: new ObjectId(user._id)
            },
            { $set: { password: hashedPassword } }
        );

        return res.status(200).json({
            Status: 'Success',
            Message: 'Password Updated Successfully',
            Data: {},
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [{ email: req.body.username }, { username: req.body.username }]
        });
        if (!user) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User not found',
                Data: {},
                Code: 404
            });
        }
        const random = `Password@${Math.floor(Math.random() * 9999)}`;
        const template = `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow:auto; line-height: 2">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0">
            <div style="border-bottom: 1px solid #eee">
              <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">Face5</a>
            </div>
            <p style="font-size: 1.1em">Hello,</p>
            <p>We received a request to reset your password for your Face5 account. Use the following password to reset your new password</p>
            <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${random}</h2>
            <p style="font-size: 0.9em;">If you didn't request a password reset, you can ignore this email.</p>
            <p style="font-size: 0.9em;">Regards,<br />Face5</p>
            <hr style="border: none; border-top: 1px solid #eee" />
            <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
              <p>Face5 Inc</p>
              <p>1600 Amphitheatre Parkway</p>
              <p>California</p>
            </div>
          </div>
        </div>
      `;
        const mailSent = await sendMailNotification(user.email, 'Reset Password', template);

        const hashedPassword = await hashPassword(random);

        const updateNewPassword = await User.findOneAndUpdate(
            {
                _id: new ObjectId(user._id)
            },
            { $set: { password: hashedPassword } }
        );

        return res.status(200).json({
            Status: 'Success',
            Message: 'Password Sent To Mail',
            Data: {},
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

module.exports = Router;
