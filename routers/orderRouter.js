import express from "express"
import { createOrder, getAllorders, updateOrderStatus } from "../controller/ordercontroller.js"


const orderRouter = express.Router()

orderRouter.post("/", createOrder)
orderRouter.get("/:pageNumber/:pageSize", getAllorders)
orderRouter.put("/:orderId", updateOrderStatus)

export default orderRouter