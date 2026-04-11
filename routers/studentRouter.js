import express from "express"
import { addStudent, getAllstudents } from "../controller/studentController.js"

const studentroute=express.Router()

studentroute.get('/',getAllstudents)

studentroute.post('/',addStudent)

export default studentroute