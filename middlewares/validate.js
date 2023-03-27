const validator=(req,res,next)=>{
    let arr=[1,2,3,4,5,6,7,8,9,0]
    let char=["!","%","@","$","^","&","*","(",")",""]
    let params=req.params.city.split("")
    for(let i=0;i<params.length;i++){
    if(arr.includes(params[i]) || char.includes(params[i])){
        res.send("invalid parameters")
        return
    }
}
    next()

}


module.exports={validator}