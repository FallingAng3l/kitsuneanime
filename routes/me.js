const { Router } = require('express'),
    fs = require('fs'),
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

route.get('/config', async (req, res) => {
    let cookie = req.cookies.token;
    if (!cookie) return res.redirect('/login')

    let user = await users.findOne({ token: cookie })
    res.render('config', {
        user
    })
})

route.post('/config', recaptcha.middleware.verify, async (req, res) => {
    let cookie = req.cookies.token,
        user = await users.findOne({ token: cookie });

    // avatar
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', async (fieldname, file, filename) => {
        if (filename.filename === undefined || filename.filename === null) {
            return res.render('config', {
                user,
                err1: true
            })
        }

        fstream = fs.createWriteStream('./handlers/uploads/' + filename.filename);
        file.pipe(fstream);
        fstream.on('close', async () => {
            const a = await client.upload({
                image: fs.createReadStream('./handlers/uploads/' + filename.filename),
                type: 'stream'
            });
            if (a.success) {
                fs.unlinkSync('./handlers/uploads/' + filename.filename)
                await users.findOneAndUpdate({ token: cookie }, { $set: { avatar: a.data.link } })
            }

            res.render('config',{
                user,
                true1: true
            })
        });
    });

    //username
    if (req.body.username === '') {
        return res.render('config', {
            user,
            err2: true
        })
    }

    let username = await users.findOne({ username: req.body.username });
    if (username) {
        return res.render('config', {
            user,
            err3: true
        })
    }

    if (req.body.username === user.username) {
        return res.render('config', {
            user,
            err4: true
        })
    }

    if (req.body.username) {
        await users.findOneAndUpdate({ token: cookie }, { $set: { username: req.body.username } });
        return res.render('config', {
            user,
            true2: true
        })
    }

    //senha
    if(req.body.pwd === '' || req.body.pwd2 === '') {
        return res.render('config', {
            user,
            err5: true
        })
    }

    if(req.body.pwd && req.body.pwd != user.password){
        return res.render('config', {
            user,
            err6: true
        })
    }

    if(req.body.pwd && req.body.pwd2 == user.password){
        return res.render('config', {
            user,
            err7: true
        })
    }

    if(req.body.pwd && req.body.pwd.length > 12 || req.body.pwd && req.body.pwd.length < 8 ) {
        return res.render('config', {
            user,
            err8: true
        })
    }

    if(req.body.pwd && req.recaptcha.error) {
        return res.render('config', {
            user,
            err9: true
        })
    }

    if(req.body.pwd2) {
        await users.findOneAndUpdate({ token: cookie}, { $set: { password: req.body.pwd2 }})
        return res.render('config', {
            user,
            true3: true
        })
    }

    // deletar conta
    if(req.body.pwd3 && req.body.pwd3 === '') {
        return res.render('config', {
            user,
            err10: true
        })
    }

    if(req.body.pwd3 && req.body.pwd3 != user.password) {
        return res.render('config', {
            user,
            err11: true
        })
    }

    if(req.body.pwd3 && req.recaptcha.error) {
        return res.render('config', {
            user,
            err12: true
        })
    }

    if(req.body.pwd3) {
        await users.findOneAndDelete({ token: cookie })
        res.clearCookie('token')
        res.redirect('/')
    }
});

module.exports = route;