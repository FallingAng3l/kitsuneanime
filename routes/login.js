const { Router } = require('express'),
    route = Router(),
    errs = require('../errors.json').login,
    users = require('../models/user');

route.get('/', async (req, res) => {
    res.render('login', {
        errs
    })
})

route.post('/', recaptcha.middleware.verify, async (req, res) => {
    if (req.body.email === '' || req.body.password === '') {
        errs.err1 = true
        return res.render('login', {
            errs
        })
    }
    let doc = await users.findOne({ email: req.body.email })

    if (!doc) {
        errs.err2 = true
        return res.render('login', {
            errs
        })

    }
})

module.exports = route;