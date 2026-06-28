import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import axios from "axios"
import OTP from "../models/otp.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.email,
        pass: process.env.app_password
    }
})

export async function createuser(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            res.status(400).json({ message: "Email already taken" })
            return
        }
        else {

            const passwordhash = bcrypt.hashSync(req.body.password, 10)

            const newuser = new User({
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: passwordhash
            })
            await newuser.save()
            res.status(201).json({ message: "Account created successfull" })
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export async function loginuser(req, res) {
    try {
        if (req.body.email == null || req.body.password == null) {
            res.status(400).json({ message: "Email and password required" })
            return
        }
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }

        const ismatch = bcrypt.compareSync(req.body.password, user.password)

        if (!ismatch) {
            res.status(401).json({ message: "Invalid password" })
            return
        }

        const token = jwt.sign({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            isadmin: user.isadmin,
            isblock: user.isblock,
            isemailverified: user.isemailverified,
            image: user.image
        }, process.env.jwt_key)

        res.status(200).json({ message: "Login successful", token: token, isadmin: user.isadmin })
    }
    catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Server error" })
    }
}

export async function getUser(req, res) {

    if (req.user == null) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    try {

        const email = req.user.email;

        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (user.isblock == true) {
            return res.status(403).json({
                message: "You are blocked"
            })
        }

        return res.status(200).json({
            user: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                isadmin: user.isadmin,
                isblock: user.isblock,
                isemailverified: user.isemailverified,
                image: user.image
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }

}

export async function updatePassword(req, res) {

    if (req.user == null) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    const password = req.body.password

    const passwordHash = bcrypt.hashSync(password, 10)

    try {

        const email = req.user.email

        await User.updateOne({ email: email }, { password: passwordHash })

        res.json({
            message: "Password updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export async function updateProfile(req, res) {

    if (req.user == null) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    try {
        const email = req.user.email

        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        await User.updateOne({ email: email }, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            image: req.body.image
        });

        res.json({
            message: "Profile updated successfully"
        })

    }
    catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export async function googleLogin(req, res) {
    try {
        const accessToken = req.body.accessToken;

        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data;

        const user = await User.findOne({ email: data.email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const passwordHash = bcrypt.hashSync(randomPassword, 10);

            const newUser = new User({
                email: data.email,
                firstname: data.given_name,
                lastname: data.family_name,
                password: passwordHash,
                image: data.picture,
                isemailverified: true
            });

            await newUser.save();

            const token = jwt.sign({
                email: data.email,
                firstname: data.given_name,
                lastname: data.family_name,
                isadmin: newUser.isadmin,
                isblock: newUser.isblock,
                isemailverified: newUser.isemailverified,
                image: newUser.image
            }, process.env.jwt_key);

            return res.json({
                message: "Login successful",
                token,
                isadmin: newUser.isadmin
            });
        }

        const token = jwt.sign({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            isadmin: user.isadmin,
            isblock: user.isblock,
            isemailverified: user.isemailverified,
            image: user.image
        }, process.env.jwt_key);

        return res.json({
            message: "Login successful",
            token,
            isadmin: user.isadmin
        });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed" });
    }
}

export async function sendOtp(req, res) {

    try {

        const email = req.body.email

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        if (user.isblock == true) {
            return res.status(403).json({
                message: "You are blocked"
            })
        }

        await OTP.deleteOne({ email: email })

        const otpNumber = Math.floor(100000 + Math.random() * 900000)

        const otpHash = bcrypt.hashSync(otpNumber.toString(), 10)

        await OTP.create({
            email: email,
            otpHash: otpHash
        })

        const message = {
            from: process.env.email,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is ${otpNumber}`
        }

        await transporter.sendMail(message)

        return res.json({
            message: "OTP sent successfully"
        })
    }
    catch (error) {
        console.error("SEND OTP ERROR:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export async function verifyOTP(req, res) {

    try {

        const email = req.body.email
        const otp = req.body.otp
        const password = req.body.password

        const otpRecord = await OTP.findOne({ email: email })

        if (otpRecord == null) {
            res.status(404).json({ message: "OTP not found" })
            return
        }

        //check if otp time passed 10 minutes

        const currentTime = new Date()
        const otpTime = new Date(otpRecord.time)

        const timeDiff = (currentTime - otpTime) / (1000 * 60) // time difference in minutes

        if (timeDiff > 10) {
            res.status(400).json({ message: "OTP has expired" })
            return
        }

        const isOTPValid = bcrypt.compareSync(otp, otpRecord.otp)

        if (!isOTPValid) {
            res.status(400).json({ message: "Invalid OTP" })
            return
        }

        const passwordHash = bcrypt.hashSync(password, 10)

        await User.updateOne({ email: email }, { password: passwordHash })

        await OTP.deleteOne({ email: email })

        res.json({ message: "Password updated successfully" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}

export async function getAllUsers(req, res) {

    if (req.user == null || req.user.isadmin == false) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    try {
        const pageSize = parseInt(req.params.pageSize) || 10;
        const pageNumber = parseInt(req.params.pageNumber) || 1;

        const userCount = await User.countDocuments();

        const users = await User.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        const totalPages = Math.ceil(userCount / pageSize);

        return res.json({
            message: "Users fetched successfully",
            users: users,
            totalPages: totalPages,
            totalUsers: userCount,
            pageNumber: pageNumber,
            pageSize: pageSize
        });

    } catch (error) {
        console.error("GET USERS ERROR:", error);
        res.status(500).json({
            message: error.message
        })
    }
}


export async function switchRole(req, res) {

    if (req.user == null || req.user.isadmin == false) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    try {

        const email = req.params.email

        const user = await User.findOne({ email: email })

        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (user.email == req.user.email) {
            return res.status(400).json({
                message: "You cannot switch your own role"
            })
        }

        await User.updateOne({ email: email }, { isAdmin: !user.isAdmin })

        res.json({ message: "User role updated successfully" })

    }
    catch (error) {
        console.log("SWITCH ROLE ERROR:", error);
        return res.status(500).json({
            message: error.message
        })
    }
}

export async function switchBlock(req, res) {

    if (req.user == null || req.user.isadmin == false) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    try {

        const email = req.params.email

        const user = await User.findOne({ email: email })

        if (user == null) {
            res.status(404).json({ message: "User not found" })
            return
        }

        if (user.email == req.user.email) {
            res.status(400).json({ message: "You cannot change your own block state" })
            return
        }

        await User.updateOne({ email: email }, { isBlocked: !user.isBlocked })

        res.json({ message: "User state updated successfully" })

    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}