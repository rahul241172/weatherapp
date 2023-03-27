const express=require('express');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {client}=require("../redis client/client")
const {UserModel}=require('../models/user.model');
const {authorization}=require('../middlewares/authorization')

const users=express.Router();

//------------------------------Signup------------------------------
users.post("/signup", async(req, res) => {
let {name,email,password}=req.body    
let data= await UserModel.find({email})
if(data.length > 0) {
    res.status(409).json({
        message: "User already exists"
    })
}
    else{
bcrypt.hash(password, 5,async(err, hash)=>{
    if(err) res.send(err)
    else{
        let user = new UserModel({name,email,password:hash})
        await user.save()
        res.status(201).json({
            message: "User created successfully"
        })
    }
})

    }
})

//------------------------------Login------------------------------

users.post("/login", async(req, res) => {

    let {email, password} = req.body
    let user = await UserModel.findOne({email})
    if(!user) {
        res.status(404).json({
            message: "User not found"
        })
    }
    else{
    bcrypt.compare(password,user.password,async(err,result)=>{
        if(err) res.send(err)
        else if(!result) {
            res.status(401).json({
                message: "Invalid credentials"
            })
        }
        else{
            let token = jwt.sign({
                id: user._id,
            }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            })
            res.cookie("jwt",token)
            res.status(200).json({
                message: "Login successful"
            })
        }
    })
    }

})


//----------------------------------logout--------------------------------

users.get("/logout",authorization,async(req,res)=>{
    let token=req.cookies.jwt
    await client.sADD("blacklist",token)
    res.status(200).json({
        message: "Logout successful"
    })
})




module.exports={
    users
}