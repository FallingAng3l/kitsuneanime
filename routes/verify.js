const user = require('../models/user');

const { Router } = require('express'),
    route = Router(),
    users = require('../models/user')

route.get('/', async (req, res) => {
    let cookie = req.cookies.token;
    if (!cookie) return res.redirect('/');


    let user = await users.findOne({ token: cookie });
    if (user.verification.state) return res.redirect('/')
    res.render('verify', {
        user
    });
})

route.post('/', async (req, res) => {
    let cookie = req.cookies.token;
    let user = await users.findOne({ token: cookie });
    if (user.verification.state) return res.redirect('/')

    if (req.body.code === '') {
        return res.render('verify', {
            user,
            err1: true
        })
    }

    if (req.body.code != user.verification.code) {
        return res.render('verify', {
            user,
            err2: true
        })
    }
    await users.findOneAndUpdate({ token: cookie }, { $set: { verification: { state: true } } })
    res.redirect('/')
})

route.get('/email', async (req, res) => {
    let cookie = req.cookies.token;
    if (!cookie) return res.redirect('/');
    let user = await users.findOne({ token: cookie });
    if (user.verification.state) return res.redirect('/')

    remetente.sendMail({
        from: process.env.email,
        to: user.email,
        subject: 'Código de verificação!',
        text: `Esse aqui é seu código de verificação ${user.verification.code}`
    })

    res.redirect('/verify')
})

module.exports = route;