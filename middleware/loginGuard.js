const guard = (req, res, next) => {
    if (req.url != '/login' && !req.session.uid)
      res.redirect('/admin/login');
    else if (req.url == '/login' && req.session.uid)
        res.redirect('/admin/user');
    else
        next();
}
module.exports = guard;