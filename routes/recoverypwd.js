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

    remetente.sendMail({
        from: process.env.email,
        to: req.body.email,
        subject: 'Trocando a senha da conta!',
        text: `Olá ${user.username}, parece que você esqueceu sua senha, caso esteja querendo trocar a senha aqui está seu código e verificação\n${user.recover}\nCaso não tenha sido você que solicitou essa troca, ignore esse email!`
    });
    res.cookie('recovery', user.token);
    res.redirect('/recoverypwd/step2');
})

route.get('/step2', async (req, res) => {
    let cookie = req.cookies.recovery,
        cookie2 = req.cookies.token;

    if (!cookie) return res.redirect('/login');
    if (cookie2) return res.redirect('/');

    let user = await users.findOne({ token: cookie })
    res.render('recpwd2', {
        user
    })
})

route.post('/step2', async (req, res) => {
    let cookie = req.cookies.recovery,
        user = await users.findOne({ token: cookie });

    if (req.body.code === '' || req.body.password === '') {
        return res.render('recpwd2', {
            user,
            err1: true
        })
    }

    if (req.body.code != user.recover) {
        return res.render('recpwd2', {
            user,
            err2: true
        })
    }

    if (req.body.password.length > 12 || req.body.password.length < 8) {
        return res.render('recpwd2', {
            user,
            err3: true
        })
    }

    await users.findOneAndUpdate({ token: cookie }, { $set: { password: req.body.password } });
    remetente.sendMail({
        from: process.env.email,
        to: req.body.email,
        subject: 'Trocando a senha da conta!',
        text: `Senha da conta alterada com sucesso!`
    });
    res.clearCookie('recovery')
    res.redirect('/login')
})

module.exports = route;