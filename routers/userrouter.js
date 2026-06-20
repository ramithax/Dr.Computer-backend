import express, { Router } from "express";
import { createuser, loginuser, getUser, updatePassword, updateProfile, googleLogin } from "../controller/usercontroller.js";

const userrouter = new Router()

userrouter.post('/', createuser)
userrouter.post('/login', loginuser)
userrouter.get("/me", getUser)
userrouter.put("/update-password", updatePassword)
userrouter.put("/update-profile", updateProfile)
userrouter.post("/google-login", googleLogin)

export default userrouter