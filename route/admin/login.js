const login= async (req, res) => {
    const {  email,  password} = req.body;
    if (email.trim().length == 0 || password.trim().length == 0)
        return res.status(200).send('error');
    const {User} = require('../../models/user');
    let user = await User.findOne({ email});
    if (user) {
        if (password == user.password)
        {
            if(user.role=='admin')
            {
                req.session.uid=user._id;
                req.app.locals.userInfo=user;
                res.status(200).send('access');
            }
            else
            {
                res.status(400).send('noaccess');
            }
        }
        else
            res.send('error');
    }
     else
         res.send('error');
}
module.exports=login;