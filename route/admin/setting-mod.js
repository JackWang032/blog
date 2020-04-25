const {Setting}=require('../../models/setting')
module.exports=async(req,res)=>{
    const {favicon,bg}=req.files;
    const {sitename,open,approval,startDate}=req.body;
    let favicon_path=favicon.path.replace(/\\/g,"/").substr(6);
    let bg_path=bg.path.replace(/\\/g,"/").substr(6);
    await Setting.update({},{
        sitename,
        openCmt:open?1:0,
        approvalCmt:approval?1:0,
        startDate
    })
    if(favicon.size!=0)
        await Setting.update({},{favicon:favicon_path});
    if(bg.size!=0)
        await Setting.update({},{bg:bg_path})
    let setting=await Setting.findOne({_id:'5e919ab750bf8d3ca435721d'});
    req.app.locals.setting=setting;
    res.status(200).send('ok')
}