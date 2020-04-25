const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    time:{
        type:Date
    },
    content:{
        type:String
    },
    to_cid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
    }
})
const Message=mongoose.model('Message',messageSchema);
module.exports={Message};
