const mongoose=require('mongoose');
const settingSchema=new mongoose.Schema({
    sitename:{
        type:String
    },
    favicon:{
        type:String
    },
    bg:{
        type:String
    },
    openCmt:{
        type:Number
    },
    approvalCmt:{
        type:Number
    },
    visitors:{
        type:Number,
        default:0
    },
    startDate:{
        type:Date,
        default:new Date()
    }
});
const Setting=mongoose.model('Setting',settingSchema);
module.exports={
    Setting
}