const { Router } = require('express'),
    route = Router(),
    users = require('../models/user'),
    animes = require('../models/animes');

route.get('/:name/:number', async (req, res) => {
    let cookie = req.cookies.token,
        anime = await animes.findOne({ name: req.params.name }),
        user = await users.findOne({ token: cookie });

    let arrays = anime.eps;
    if (!isNaN(req.params.number)) {
        if (req.params.number > anime.eps.length) {
            return res.render('404')
        }

        return res.render('ep', {
            user,
            anime,
            number: req.params.number
        })
    }

    if (req.params.number === 'eps') {
        let kk = [];

        for (let i = 0; i < arrays.length; i++) {
            let a = `<a class="btn btn-outline-light text-start" role="button" href="/animes/${req.params.name}/${arrays[i].number}">Episódio ${arrays[i].number}</a>`
            kk.push(`${a}`);
        }

        return res.render('eps', {
            user,
            anime,
            kk: kk.join('\n')
        })
    }

})

module.exports = route;