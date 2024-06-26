// const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const axios = require("axios")
const env = require('dotenv');

env.config();


exports.signup = async (req, res) => {

    if (req.body.googleAccessToken) {

        const data = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${req.body.googleAccessToken}`,
            },
        });

        if (data) {

            const userName = data.data.name;
            const emailId = data.data.email;


            const userExists = await User.findOne({ emailId });
            const role = "user";

            if (userExists && userExists.isVerified == false) {
                res.status(201).json({ msg: "Please verify your mail. mail is already send" });
            } else if (userExists) {
                res.status(202).json({ msg: "User already exist" });
            }

            const isVerified = false;
            const hashPassword = await bcrypt.hash("password", 10);
            const user = await User.create({
                userName,
                emailId,
                hashPassword,
                role,
                isVerified
            });

            const token = jwt.sign({
                email: user.emailId,
                id: user._id
            }, process.env.JWT_SECRET, { expiresIn: "4h" })

            // res.status(201).json({
            //     msg: "User Created Successfully",
            //     User: {
            //         _id: user._id,
            //         username: user.userName,
            //         emailId: user.emailId,
            //         role: user.role
            //     },
            //     Token: { token }
            // });

            if (verifymailsenderonaccountcreation(emailId, hashPassword, user._id)) {
                return res.status(200).json({ msg: "Mail has send Successfully", email: emailId })
            } else {
                return res.status(201).json({ msg: "Unable to create account" });
            }
        } else {
            return res.status(400).json({ msg: "Unable to create account" });
        }


    } else {

        const { userName, emailId, password, mobilenumber, address } = req.body;

        if (!userName || !emailId || !password) {
            return res.status(400).json({ msg: "Please Enter all the Fields" });
        }

        const userExists = await User.findOne({ emailId });

        // if (userExists) {
        //     return res.status(400).json({ msg: "User already exist" });
        // }

        if (userExists && userExists.isVerified == false) {
            res.status(201).json({ msg: "Please verify your mail. mail is already send" });
        } else if (userExists) {
            res.status(202).json({ msg: "User already exist" });
        }

        const isVerified = false;
        const role = "user";
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userName,
            emailId,
            hashPassword,
            role,
            isVerified,
            address,
            mobilenumber
        });

        const token = jwt.sign({
            email: user.emailId,
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "4h" })

        // if (user) {
        //     return res.status(201).json({
        //         msg: "User Created Successfully",
        //         User: {
        //             _id: user._id,
        //             username: user.userName,
        //             emailId: user.emailId,
        //             role: user.role
        //         },
        //         Token: token
        //     });
        // }

        if (verifymailsenderonaccountcreation(emailId, hashPassword, user._id)) {
            return res.status(200).json({ msg: "Mail has send Successfully" })
        }
        else {
            return res.status(400).json({ msg: "Unable to create user account" });
        }
    }

};


exports.login = async (req, res) => {

    if (req.body.googleAccessToken) {
        const data = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${req.body.googleAccessToken}`,
            },
        });

        if (data) {
            const emailId = data.data.email;

            const user = await User.findOne({ emailId });

            if (!user) {
                return res.status(400).json({ msg: "User does not exist" });
            } else if (user.isVerified == false) {
                return res.status(201).json({ msg: "Please verify your mail" });
            }

            const token = jwt.sign({
                email: user.emailId,
                id: user._id
            }, process.env.JWT_SECRET, { expiresIn: "4h" })


            return res.status(200).json({
                msg: "User loggedIn Successfully",
                User: {
                    _id: user._id,
                    userName: user.userName,
                    emailId: user.emailId,
                    role: user.role,
                    mobilenumber: user.mobilenumber,
                    address: user.address
                },
                Token: { token }
            });

        } else {
            return res.status(400).json({ msg: "User does not exist" });
        }


    } else {
        const { emailId, password, googleAccessToken } = req.body;
        if (!emailId || !password) {
            return res.status(400).json({ msg: "Please Enter all the Fields" });
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        } else if (user.isVerified == false) {
            return res.status(201).json({ msg: "Please verify your mail" });
        }

        if (user) {
            const isValid = await bcrypt.compare(password, user.hashPassword)

            if (!isValid) {
                return res.status(400).json({ msg: "Invalid info!" });
            }
            else {

                const token = jwt.sign({
                    email: user.emailId,
                    id: user._id
                }, process.env.JWT_SECRET, { expiresIn: "4h" })

                return res.status(200).json({
                    msg: "You Loggedin Successfully",
                    User: {
                        _id: user._id,
                        userName: user.userName,
                        emailId: user.emailId,
                        role: user.role,
                        mobilenumber: user.mobilenumber,
                        address: user.address
                    },
                    Token: { token }
                });
            }

        }
        else {
            return res.status(400).json({ msg: "User Not Found" });
        }
    }

};

const verifymailsenderonaccountcreation = async (email, hashPassword, id) => {

    try {

        const secret = process.env.JWT_SECRET + hashPassword;
        const token = jwt.sign({ email: email, id: id }, secret, {
            expiresIn: "4h"
        })
        const link = `${process.env.API_URL}verifymailonaccountcreation/${id}/${token}`;
        var transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sendermail169@gmail.com',
                pass: 'djlhryfqbkxezfgh'
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Verify Email',
            text: link
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return true;

    }
    catch (error) {

    }

};



exports.verifyNewMail = async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        const UpdateInfo = await User.updateOne({
            _id: id,
        }, {
            $set: {
                isVerified: true
            }
        })

        return res.status(201).json({ msg: "Account Verified Successfully", Info: UpdateInfo });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Verify Mail" });
    }

};


exports.verifyMail = async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        const UpdateInfo = await User.updateOne({
            _id: id,
        }, {
            $set: {
                isverified: true
            }
        })

        return res.status(201).json({ msg: "Account Verified Successfully", Info: UpdateInfo });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Verify Mail" });
    }
};

exports.forgotpassword = async (req, res) => {
    const { emailId } = req.body;
    if (!emailId) {
        return res.status(400).json({ msg: "Please Enter all the Fields" });
    }
    try {
        const user = await User.findOne({ emailId });
        if (user) {

            const secret = process.env.JWT_SECRET + user.hashPassword;
            const token = jwt.sign({ email: user.emailId, id: user._id }, secret, {
                expiresIn: "5m"
            })
            const link = `${process.env.API_URL}reset-password/${user._id}/${token}`;
            var transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sendermail169@gmail.com',
                    pass: 'djlhryfqbkxezfgh'
                }
            });

            var mailOptions = {
                from: 'youremail@gmail.com',
                to: emailId,
                subject: 'Password Reset',
                text: link
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return res.status(201).json({ msg: "Email Has Send!!" });

        } else {
            return res.status(400).json({ msg: "User Not Exists!!" });
        }
    } catch (error) {

    }

};

exports.resetpassword = async (req, res) => {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    const secret = process.env.JWT_SECRET + user.hashPassword;
    try {
        const verify = jwt.verify(token, secret);
        res.render("resetpassword", { email: verify.email, status: "Not Verified" })
    } catch (error) {
        return res.status(400).json({ msg: "Not Verified" });
    }
};

exports.resetpassworddone = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    const secret = process.env.JWT_SECRET + user.hashPassword;
    try {
        const verify = jwt.verify(token, secret);
        const hashPassword = await bcrypt.hash(password, 10);

        await User.updateOne({
            _id: id,
        }, {
            $set: {
                hashPassword: hashPassword
            }
        })
        return res.status(201).json({ msg: "Password is Successfully Updated" });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Update password" });
    }
};

exports.getHotels = async (req, res, next) => {
    try {
        const hotels = await User.find({ role: "hotel", isVerified: true }, { "hashPassword": 0 });
        if (!hotels) {
            hotels = [];
        }
        res.status(200).send({ success: true, hotels: hotels });
    }
    catch (err) {
        res.status(500).send({
            message: "internal server error",
            success: false,
        })
    }
}


exports.userinfo = async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        return res.status(201).json({ msg: "User Info Fetched Successfully", info: user });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to fetch info" });
    }
};

exports.edituserinfo = async (req, res) => {
    const { id, userName, mobilenumber, address, description, hotelStatus, minimumAmount } = req.body;
    // console.log(hotelStatus, "hotelstatus")

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        await User.updateOne({
            _id: id,
        }, {
            $set: {
                userName: userName,
                mobilenumber: mobilenumber,
                address: address,
                description: description,
                hotelStatus: hotelStatus,
                minimumAmount: minimumAmount
            }
        })
        return res.status(201).json({ msg: "User Info Updated Successfully", info: user });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to fetch info" });
    }
};