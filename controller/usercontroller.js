import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function createuser(req,res){
    try{
        const user=await User.findOne({email:req.body.email})

        if(user){
            res.json({message:"Email already taken"})
            return
        }
        else{

            const passwordhash=bcrypt.hashSync(req.body.password,10)

            const newuser=new User({
                email:req.body.email,
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                password:passwordhash
            })
            await newuser.save()
            res.json({message :"Account created successfull"})
        }

    }catch(error){
        res.status(500).json({ message: "Server error" })
    }
}

export async function loginuser(req,res){
    try{
        if(req.body.email == null || req.body.password == null){
            res.status(400).json({message :"Email and the password required "})
            return
        }
        const user=await User.findOne({email:req.body.email})

        if(user){
            const ismatch=bcrypt.compareSync(req.body.password, user.password)

            if(ismatch){
                const token= jwt.sign({
                    email:user.email,
                    firstname:user.firstname,
                    lastname:user.lastname,
                    isadmin:user.isadmin,
                    isblock:user.isblock,
                    isemailverified:user.isemailverified,
                    image:user.image
                },process.env.jwt_key)

                res.json({message : "Login successfull",token:token})
                return          
            }
            else{
                res.status(401).json({message:"Invalid password"})
            }
        }
        else{
            res.status(404).json({message :"User not found"})
            return
        }
    }
    catch(error){
        return res.json({
            message: "Server error"
        })
    }
}