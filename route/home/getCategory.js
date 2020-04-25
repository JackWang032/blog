const {Category}=require('../../models/category');
const category = async function () {
       const result=await Category.aggregate([
        {
          $lookup:
            {
              from: "articles",
              localField: "cgid",
              foreignField: "category",
              as: "categoryInfo"
            }
       }
     ]);
     for(var i=0;i<result.length;i++){
        result[i].count=result[i].categoryInfo.length;
    }
    result.sort(function(a,b){
        return b.count - a.count
    })
     return result
};
module.exports.category= category;
