const {User,validataUser}=require('../../models/user');
module.exports = async(req, res) => {
    let {id}=req.query;
    try {
        //await validataUser(req.body);
        let user=await User.findOne({
            email:req.body.email,
            _id:{$ne:id}
        });
        if(user)
          return  res.redirect(`/admin/user-edit?id=${id}&message=邮箱地址已被使用`);
        else
           { 
               await User.updateOne({_id:id},req.body);
               console.log('用户修改成功');
               res.redirect('/admin/user');
           }
    } catch (error) {
        return res.redirect(`/admin/user-edit?id=${id}&message=${error.message}`);
    }
}