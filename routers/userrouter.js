import express, { Router } from "express";
import { createuser, loginuser, getUser, updatePassword, updateProfile, googleLogin, sendOtp, verifyOTP, getAllUsers, switchRole, switchBlock } from "../controller/usercontroller.js";

const userrouter = new Router()

userrouter.post('/', createuser)
userrouter.post('/login', loginuser)
userrouter.get("/me", getUser)
userrouter.put("/update-password", updatePassword)
userrouter.put("/update-profile", updateProfile)
userrouter.post("/google-login", googleLogin)
userrouter.post("/send-otp", sendOtp)
userrouter.post("/verify-otp", verifyOTP)
userrouter.get('/all/:pageNumber/:pageSize', getAllUsers)
userrouter.put('/role/:email', switchRole)
userrouter.put('/block/:email', switchBlock)

export default userrouter  