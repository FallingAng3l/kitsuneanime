const { Router } = require('express'),
    route = Router(),
    users = require('../models/user');

route.get('/', async (req, res) => {
    let cookie = req.cookies.token;
    if(cookie) return res.redirect('/')
    
    res.render('login')
})

route.post('/', recaptcha.middleware.verify, async (req, res) => {
    if (req.body.email === '' || req.body.password === '') {
        return res.render('login', {
            err1: true
        })
    }
    let doc = await users.findOne({ email: req.body.email });

    if (!doc) {
        return res.render('login', {
            err2: true
        })
    };

    if (doc && doc.password !== req.body.password) {
        return res.render('login', {
            err3: true
        })
    };

    if (req.recaptcha.error) {
        return res.render('login', {
            err4: true
        })
    };

    res.cookie('token', doc.token, { maxAge: 999999999 });
    if (doc.verification.state === false) return res.redirect('/verify')
    res.redirect('/')
})

module.exports = route;