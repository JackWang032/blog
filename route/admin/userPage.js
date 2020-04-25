const userPage=async(req, res) => {
    const {User}=require('../../models/user');
    let page=req.query.page||1;//当前请求页
    let pagesize=12; //每页数据条数
    let count=await User.countDocuments(); //用户总数
    let total=Math.ceil(count/pagesize);//总页数
    let userList=await User.find().limit(pagesize).skip((page-1)*pagesize);
    res.render('admin/user',{
        msg:req.session.username,
        userList:userList,
        count:count,
        total:total,
        page:page
    });
}
module.exports=userPage ;