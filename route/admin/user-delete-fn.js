const {User}=require('../../models/user');
module.exports = async(req, res) => {
    try {
        let {id}=req.query;
        await User.deleteOne({_id:id});
        console.log('用户删除成功');
        res.redirect('/admin/user');
    } catch (error) {
        return res.redirect(`/admin/user-edit?message=${error.message}`);
    }
}