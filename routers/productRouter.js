import express from "express"
import { createproduct, deleteproduct, getallproducts, getProductbyId, updateproduct } from "../controller/productcontroller.js"

const productRouter=express.Router()

productRouter.post('/',createproduct)
productRouter.get('/',getallproducts)
productRouter.get('/:productId',getProductbyId)
productRouter.delete('/:productId',deleteproduct)
productRouter.put('/:productId',updateproduct)

export default productRouter
