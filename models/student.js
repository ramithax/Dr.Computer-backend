import mongoose from "mongoose";

const studentschema=new mongoose.Schema({
    name:String,
    age:Number,
    city:String
})

const student=mongoose.model("student",studentschema)

export default student