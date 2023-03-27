const jwt=require("jsonwebtoken")
require("dotenv").config()

const {UserModel} = require("../models/user.model")
const { client } = require("../redis client/client")


const authorization = async(req,res,next)=>{
   let token= req.cookies.jwt
   let blacklist= await client.get("blacklist")
   if(blacklist && blacklist.includes(token) || !token){
    return res.status(401).json({
      message:"Please Login first"
    })
   }
   else{
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
      if(err){
        return res.status(401).json({
          message:"please login"
        })
      }
      req.user=decoded
      next()
    })
   }
}




module.exports={
  authorization
}