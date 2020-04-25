const {User,validataUser}=require('../../models/user');
module.exports = async(req, res) => {
    try {
       // await validataUser(req.body);
        let user=await User.findOne({email:req.body.email});
        if(user)
               return res.redirect(`/admin/user-edit?message=邮箱地址已被使用`);
        else
           { 
               User.create(req.body);
               console.log('用户添加成功');
               res.redirect('/admin/user');
           }
    } catch (error) {
        return res.redirect(`/admin/user-edit?message=${error.message}`);
    }
}