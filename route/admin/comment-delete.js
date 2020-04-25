const {Comment}=require('../../models/comment')
var del_id=[]; //要删除评论下的子评论
function getParent(cmtlist,index,cid,cur){
    if(!cmtlist[index].to_cid)return
    if(cmtlist[index].to_cid._id==cid)
    {
        del_id.push(cmtlist[cur]._id);
        return;
    }
    for(var i=0;i<cmtlist.length;i++){ //找上一级父评论
        if(JSON.stringify(cmtlist[i]._id)==JSON.stringify(cmtlist[index].to_cid._id))
            {   
                getParent(cmtlist,i,cid,cur);
                return;
            }
    }
}
module.exports=async(req,res)=>{
    const {id}=req.query;
    let comments=await Comment.find().populate('to_cid');
    del_id.push(id);
    console.log(typeof(id));
    for(var i=0;i<comments.length;i++){
        if(comments[i].to_cid)
           getParent(comments,i,id,i);
    }
    for(var i=0;i<del_id.length;i++){
        await Comment.deleteOne({_id:del_id[i]})
    }
    res.redirect('/admin/comment')
}