module.exports.run = async(req, res) => {
    let cookie = req.cookies.code;
    if(cookie) return res.redirect('/me');

    res.render('login', {
        err1: false,
        err2: false,
        err3: false,
        err4: false
    })
}