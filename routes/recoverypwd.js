const { Router } = require('express'),
    route = Router(),
    users = require('../models/user');

route.get('/', async (req, res) => {
    let cookie = req.cookies.token;
    if (cookie) return res.redirect('/')

    res.render('recpwd')
})

route.post('/', async (req, res) => {
    if (req.body.email === '') {
        return res.render('recpwd', {
            err1: true
        })
    }

    let user = await users.findOne({ email: req.body.email });
    if (!user) {
        return res.render('recpwd', {
            err2: true
        })
    }
    let code = Math.round(Math.random() * 999999);

    remetent.sendMail({
        from: process.env.email,
        to: req.body.email,
        subject: 'Trocando a senha da conta!',
        text: `Olá ${user.username}, parece que você esqueceu sua senha, caso esteja querendo trocar a senha aqui está seu código e verificação\n${code}\nCaso não tenha sido você que solicitou essa troca, ignore esse email!`
    });
    await users.findOneAndUpdate({ email: req.body.email }, { $set: { recover: code } });
    res.cookie('recovery', user.token);
    res.redirect('/recoverypwd/step2');
})

route.get('/step2', async(req, res) => {
    let cookie = req.cookies.recovery,
    cookie2 = req.cookies.token;

    if(!cookie) return res.redirect('/login');
    if(cookie2) return res.redirect('/');

    let user = await users.findOne({ token: cookie })
    res.render('recpwd2', {
        user
    })
})

module.exports = route;