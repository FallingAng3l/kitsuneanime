const err = require('../errs.json').login,
    user = require('../models/user');

module.exports.run = async (req, res) => {

    if (req.body.email === '' || req.body.password === '') {
        err.err1 = true
        return res.render('login', {
            err
        })
    }

    let doc = await user.findOne({ email: req.body.email })
    if(!doc) {
        err.err2 = true
    }
    console.log(req.body)
    res.redirect('/login')
}