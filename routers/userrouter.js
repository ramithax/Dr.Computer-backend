import express, { Router } from "express";
import { createuser, loginuser } from "../controller/usercontroller.js";

const userrouter=new Router()

userrouter.post('/',createuser)
userrouter.post('/login',loginuser)

export default userrouter