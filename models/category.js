const mongoose=require('mongoose');
const CategorySchema=new mongoose.Schema({
    cgname:{
        type:String
    },
    cgid:{
        type:Number
    },
    intro:{
        type:String,
        default:'这个博主很懒，什么也没留下'
    },
    cover:{
        type:String,
        default:''
    }
})
const Category=mongoose.model('Category',CategorySchema);
module.exports={
    Category
}