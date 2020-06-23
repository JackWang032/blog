const JWT=require('../jwt.js')
module.exports=(req,res,next)=>{
    let token=req.headers['authorization']
    if(token){
        let jwt=new JWT(token)
        let result=jwt.verifyToken()
        if(result!='err')return next();
    }
    res.sendResult(null,400,'无效token')
}