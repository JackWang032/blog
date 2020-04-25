const {User}=require('../../models/user');
module.exports=async(req,res)=>{
    const {message,id}=req.query;
    if(id){
        let user=await User.findOne({_id:id});
        res.render('admin/user-edit',{
            user:user,
            message:message,
            link:`/admin/user-edit?id=${id}`
        })
    }
    else
         res.render('admin/user-edit',{
           message:message,
           link:'/admin/user-add'
    });
}