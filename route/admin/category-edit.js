const {Category}=require('../../models/category')
module.exports=async(req,res)=>{
    let {id,cgname,intro}=req.body;
    let cover=req.files.cover;
    if(intro=='')
        intro='这个博主很懒，什么也没留下'
    if(cover.size==0)
        await Category.updateOne({_id:id},{
            cgname,
            intro
        })
    else
    {
        let path=cover.path.replace(/\\/g,"/").substr(6);
        await Category.updateOne({_id:id},{
            cgname,
            intro,
            cover:path
        })
    }
    res.status(200).send('OK')
}