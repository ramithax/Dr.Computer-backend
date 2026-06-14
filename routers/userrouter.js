import express, { Router } from "express";
import { createuser, loginuser, getUser } from "../controller/usercontroller.js";

const userrouter = new Router()

userrouter.post('/', createuser)
userrouter.post('/login', loginuser)
userrouter.get("/", getUser)

export default userrouter