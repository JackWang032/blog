const Category=require('../home/getCategory')
module.exports=async(req,res)=>{
    const categorys=await Category.category();
    res.render('admin/category',{
        categorys
    })
}