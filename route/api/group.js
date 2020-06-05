const {Article}=require('../../models/article');
const express = require('express');
const router = express.Router();
router.get('/',async(req, res) => {
    let group=await Article.aggregate([  //归档月份分组
        { 
            $project : {
                Day : {
                    "$dateToString" : {
                        "format" : "%Y-%m", 
                        "date" : "$publishDate"
                    }
                }
            }
        },
        {
            $group:{
                _id:"$Day"
            }
        },
        {
            $sort:{
                _id:-1
            }
        }
    ])
    var dateList=[];
    for (var i=0;i<group.length;i++){
        let obj={};
        obj.month=group[i]._id.substr(0,4)+'年'+group[i]._id.substr(5,2)+'月';
        obj.articles=await Article.aggregate([
            {
                $project:{
                    _id:1,
                    title:1,
                    Day : {
                        "$dateToString" : {
                            "format" : "%Y-%m", 
                            "date" : "$publishDate"
                        }
                    }
                }
            },
            {
                $match:{
                    Day:group[i]._id
                }

            }
        ])
        dateList.push(obj)
    }
    res.sendResult(dateList,200,'获取成功')
})
module.exports= router