const express=require('express')
require("dotenv").config()
const app=express()
var cookieParser = require('cookie-parser')
const {connection}=require('./config/db.js')
const {users}=require('./routes/user.route')
const {weather}=require('./routes/weather.route')
app.use(express.json())

app.use(cookieParser())

const winston = require('winston');
const expressWinston=require('express-winston');
require('winston-mongodb');
app.use(expressWinston.logger({
    transports: [
      new winston.transports.MongoDB({
      level:"silly",
      db:process.env.mongodb
      })
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  }));


app.use("/users",users)
app.use("/weather",weather)


app.get("/",(req, res) =>{
    res.send("hello")
})








app.listen(process.env.port,async()=>{
    try{
    await connection
    console.log('server is running')
    }catch(e){
        console.log(e)
    }
})