const mongoose=require('mongoose')
const labSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    cover:{
        type:String
    },
    time:{
        type:Date
    },
    intro:{
        type:String
    }
})
const Lab=mongoose.model('Laboratory',labSchema);
module.exports={Lab};