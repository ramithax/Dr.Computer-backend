import express from "express"
import { createOrder, getAllorders } from "../controller/ordercontroller.js"

const orderRouter = express.Router()

orderRouter.post("/", createOrder)
orderRouter.get("/:pageNumber/:pageSize", getAllorders)

export default orderRouter