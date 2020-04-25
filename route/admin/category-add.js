const {Category}=require('../../models/category');
module.exports=async(req,res)=>{
    let {cgname,intro}=req.body;
    let cover=req.files.cover;
    let cgsorted=await Category.find().sort('-cgid')
    let cgid=cgsorted[0].cgid+1;
    let path=cover.path.replace(/\\/g,"/").substr(6);
    if(intro=='')
        intro='这个博主很懒，什么也没留下'
    await Category.create({
        cgname,
        cgid,
        intro,
        cover:path
    });
    res.status(200).send('ok')
}