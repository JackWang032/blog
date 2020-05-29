// 添加统一的返回结果方法
module.exports = function(req, res, next){
	res.sendResult = function(data,code,message) {
			res.json(
			{
				"data" : data, 
				"meta" : {
					"msg" 		: message,
					"status" 	: code
				}
			});
		
	};
	next();
}