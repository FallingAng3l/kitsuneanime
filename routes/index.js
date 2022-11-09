const { Router } = require('express'),
    route = Router(),
    users = require('../models/user');

route.get('/', async (req, res) => {
    let cookie = req.cookies.token;
    if (!cookie) {
        return res.render('index', {
            user: null
        });
    };

    let user = await users.findOne({ token: cookie });
    res.render('index', {
        user
    });
});

module.exports = route;