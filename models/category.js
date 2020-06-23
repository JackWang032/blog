const mongoose=require('mongoose');
const CategorySchema=new mongoose.Schema({
    cgname:{
        type:String,
        required:true,
        unique:true
    },
    cgid:{
        type:Number,
        required:true,
        unique:true
    },
    intro:{
        type:String,
        default:'这个博主很懒，什么也没留下'
    },
    cover:{
        type:String,
        default:''
    },
    createtime:{
        type:Date
    }
    
})
const Category=mongoose.model('Category',CategorySchema);
module.exports={
    Category
}