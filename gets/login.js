const err = require('../errs.json').login

module.exports.run = async(req, res) => {
    let cookie = req.cookies.code;
    if(cookie) return res.redirect('/me');

    res.render('login', {
        err
    })
}