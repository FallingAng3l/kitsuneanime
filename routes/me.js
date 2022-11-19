const { Router } = require('express'),
    route = Router(),
    users = require('../models/user');

route.get('/', async (req, res) => {
    let cookie = req.cookies.token;
    if (!cookie) return res.redirect('/login');

    let user = await users.findOne({ token: cookie });

    res.render('me', {
        user
    })
})

module.exports = route;