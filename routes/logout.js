const { Router } = require('express'),
route = Router();

route.get('/', async(req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = route