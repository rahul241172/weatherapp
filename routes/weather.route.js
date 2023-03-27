const express=require('express');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {client}=require("../redis client/client")
const {UserModel}=require('../models/user.model');
const {authorization}=require('../middlewares/authorization')
const {validator}=require('../middlewares/validate')

const weather=express.Router();


weather.get('/:city',authorization,validator,async (req,res)=>{
  let city=req.params.city
  let value=req.query.value
    console.log(city)
    let data= await client.get(city)
    if(data){
        res.send(data)
    }
    else{
        await client.set(city,value,{
            EX:1800
        })
        res.send(city,value)
    }
})















module.exports = {weather}