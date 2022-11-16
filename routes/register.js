const { Router } = require('express'),
    route = Router(),
    users = require('../models/user');

route.get('/', async (req, res) => {
    let cookie = req.cookies.token;
    if (cookie) return res.redirect('/')

    res.render('register')
})

route.post('/', recaptcha.middleware.verify, async (req, res) => {
    if (req.body.email === '' || req.body.username === '' || req.body.pwd === '' || req.body.pwd2 === '') {
        return res.render('register', {
            err1: true,
        })
    };

    let username = await users.findOne({ username: req.body.username }),
        email = await users.findOne({ email: req.body.email });

    if (username) {
        return res.render('register', {
            err2: true,
        })
    }

    if (email) {
        return res.render('register', {
            err3: true
        })
    }

    if (req.body.pwd.length > 12 || req.body.pwd.length < 8) {
        return res.render('register', {
            err4: true
        })
    }

    if (req.body.pwd !== req.body.pwd2) {
        return res.render('register', {
            err5: true
        })
    }

    if(req.recaptcha.error) {
        return res.render('register', {
            err6: true
        })
    }
    let code = Math.floor(Math.random() * 999999)

    remetente.sendMail({
        from: process.env.email,
        to: req.body.email,
        subject: 'Código de verificação!',
        text: `Esse aqui é seu código de verificação ${code}`
    })
    let token = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 20);
    let docu = new users({
        email: req.body.email,
        username: req.body.username,
        avatar: 'https://media.discordapp.net/attachments/915734811375710238/985305930314960907/unknown.png',
        password: req.body.pwd,
        token: token,
        admin: false,
        recover: 'null',
        verification: {
            code: code,
            state: false
        }
    })

    docu.save();
    res.redirect('/login')
})

module.exports = route;