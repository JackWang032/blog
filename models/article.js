const mongoose=require('mongoose');
const joi = require('joi');
const articleSchema=new mongoose.Schema({
    title:{
        type:String,
        maxlength:30,
        minlength:4,
        required:[true,'请填写文章标题']
    },
    publishDate:{
        type:Date,
    },
    cover:{
        type:String,
    },
    content:{
        type:String,
        default:null
    },
    category:{
        type:Number,
        default:0
    },
    pageviews:{
        type:Number,
        default:1
    },
    openCmt:{
       type:Number,
       default:1
    },
    original:{
        type:Number,
        default:1
    },
    intro:{
        type:String
    },
    tags:{
        type:String
    },
    public:{
        type:Number,
        default:1
    }
});
const Article=mongoose.model('Article',articleSchema);
const validataArticle = (article) => {
    const schema = {
        title: joi.string().required().min(4).max(30).error(new Error('标题不合法')),
        content: joi.string().trim().required().error(new Error('内容不合法')),
        author:joi.string().required(),
        content:joi.string().required(),
        cover:joi.string(),
        publishDate:joi.required(),
        category:joi.number(),
        pageviews:joi.number()
    }
    return joi.validate(article, schema);
}
module.exports={
    Article,
    validataArticle
}