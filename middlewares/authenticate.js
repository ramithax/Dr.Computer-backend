import jwt from "jsonwebtoken"

export default function authenticate(req,res,next){
    const header=req.header("Authorization")

    if(header==null){
        next()
    }else{
        const token=header.replace("Bearer ","")
        jwt.verify(token,"secretkey99",(err,decoded)=>{
            if(decoded==null){
                res.status(401).json({message:"Invalid token"})
            }else{
                req.user=decoded
                next()
            }
        })
    }
}