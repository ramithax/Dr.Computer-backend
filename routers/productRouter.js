import express from "express"
import { createproduct, deleteproduct, getallproducts, getProductbyId, searchProduct, updateproduct } from "../controller/productcontroller.js"

const productRouter = express.Router()

productRouter.get('/search/:query', searchProduct)
productRouter.post('/', createproduct)
productRouter.get('/', getallproducts)
productRouter.get('/:productId', getProductbyId)
productRouter.delete('/:productId', deleteproduct)
productRouter.put('/:productId', updateproduct)

export default productRouter
