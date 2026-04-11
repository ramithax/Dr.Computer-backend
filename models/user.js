import mongoose from "mongoose";

const userschema=new mongoose.Schema(
    {
        email:{
            type: String,
            required:true,
            unique:true
        },
        firstname:{
            type:String,
            required:true,
        },
        lastname:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        isadmin:{
            type:Boolean,
            required:true,
            default:false
        },
        isblock:{
            type:Boolean,
            required:true,
            default:false
        },
        isemailverified:{
            type:Boolean,
            required:true,
            default:false
        },
        image:{
            type:String,
            required:true,
            default:"/default-profile.png"
        }
    }
)

const User=mongoose.model("User",userschema)

export default User