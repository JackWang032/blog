const mongoose=require('mongoose');
const commentSchema=new mongoose.Schema({
    aid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Article',
        required:true
    },
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    time:{
        type:Date
    },
    content:{
        type:String,
        required:true
    },
    to_cid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
    },
    status:{
        type:Number,
        default:1
    }
})
const Comment=mongoose.model('Comment',commentSchema);
module.exports={Comment};
