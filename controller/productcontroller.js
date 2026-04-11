import Product from "../models/product.js"

export async function createproduct(req,res){
    if(req.user==null){
        res.status(401).json({message:"unauthorized"})
        return
    }
    if(!req.user.isadmin){
        res.status(403).json({message:"Only admins can create products"})
        return
    }
    try{
        const existing=await Product.findOne({productId:req.body.productId})

        if(existing){
            res.status(400).json({message:"Product with this productId is already exist"})
            return
        }
        const product=new Product(req.body)
        await product.save()
        res.status(200).json({message:"Product created successfully"})

    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export async function getallproducts(req,res){
    try{
        if(req.user != null && req.user.isadmin ){
            const products=await Product.find()
           res.json(products) 
        }else{
            const products= await Product.find({isavailable:true})
            res.json(products)
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export async function deleteproduct(req,res){
    if(req.user != null && req.user.isadmin){
        try{
            const product=await Product.findOne({productId:req.params.productId})

            if(product){
                await product.deleteOne()
                res.status(200).json({message:"Product Deleted"})
                return
            }else{
                res.json({message:"No such product"})
                return
            }
        }catch(error){
            res.json(error.message)
            return
        }
    }else{
        return res.status(403).json({ message: "Only admins can delete products" });
    }
}

export async function updateproduct(req,res){
    if(req.user != null && req.user.isadmin){
        try{
            if(req.body.productId != null){
                res.status(400).json({message:"ProductId cannot be updated"})
                return
            }
            await Product.updateOne({productId:req.params.productId},req.body)
            res.status(200).json({message:"Product updated successfully"})
        }catch(error){
            res.json(error.message)
            return
        }
    }else{
        res.status(403).json({message:"Only admins can delete products"})
        return
    }
}

export async function getProductbyId(req,res){
    try{
        const product=await Product.findOne({productId:req.params.productId})

        if(product == null ){
            res.status(404).json({message:"Product not available"})
            return
        }
        if(product.isavailable){
            res.json(product)
        }else{
            if(req.user.isadmin){
                res.json(product)
            }
        }
    }catch(error){
        res.json(error.message)
            return
    }

}