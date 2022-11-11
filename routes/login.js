const { Router } = require('express'),
    route = Router(),
    users = require('../models/user');

route.get('/', async (req, res) => {
    res.render('login', {
        err1: false,
        err2: false,
        err3: false,
        err4: false
    })
})

route.post('/', recaptcha.middleware.verify, async (req, res) => {
    if (req.body.email === '' || req.body.password === '') {
        return res.render('login', {
            err1: true,
            err2: false,
            err3: false,
            err4: false
        })
    }
    let doc = await users.findOne({ email: req.body.email });

    if (!doc) {
        return res.render('login', {
            err1: false,
            err2: true,
            err3: false,
            err4: false
        })
    };

    if (doc && doc.password !== req.body.password) {
        return res.render('login', {
            err1: false,
            err2: false,
            err3: true,
            err4: false
        })
    };

    if (req.recaptcha.error) {
        return res.render('login', {
            err1: false,
            err2: false,
            err3: false,
            err4: true
        })
    };

    res.cookie('token', doc.token);
    if (doc.verification.state === false) return res.redirect('/verify')
    res.redirect('/')
})

module.exports = route;