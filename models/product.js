import mongoose from "mongoose"

const productschema=new mongoose.Schema({
    productId:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    altnames:{
        type:[String],
        default:[],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    labeledprice:{
        type:Number,
        required:true
    },
    images:{
        type:[String],
        default:["default-product-1.png","default-product-2.png"],
        required:true
    },
    isavailable:{
        type:Boolean,
        required:true,
        default:true
    },
    category:{
        type:String,
        required:false
    },
    stock:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        required:false
    },
    model:{
        type:String,
        required:false
    }
})

const Product=mongoose.model("product",productschema)

export default Product