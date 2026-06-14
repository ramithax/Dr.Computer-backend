import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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