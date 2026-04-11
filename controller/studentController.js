import student from "../models/student.js"

 export function getAllstudents(req,res){
    student.find().then((students)=>{
        res.json(students)
    })
}

export function addStudent(req,res){

    if(req.user==null){
        res.status(401).json({message:"Unauthorized"})
        return
    }
    if(req.user.isadmin==false){
        res.status(403).json({message:"Only admins can create students"})
        return
    }
    
    const newstudent=new student(req.body)
    newstudent.save().then(()=>{
        res.json({
            message:"Account Created"
        })
    })
}