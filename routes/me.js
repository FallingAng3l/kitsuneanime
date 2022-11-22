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

route.get('/config', async(req, res) => {
    let cookie = req.cookies.token;
    if(!cookie) return res.redirect('/login')

    let user = await users.findOne({ token: cookie })
    res.render('config', {
        user
    })
})

route.post('/config', async(req, res) => {
let cookie = req.cookies.token,
user = await users.findOne({ token: cookie });

    // avatar
var fstream;
req.pipe(req.busboy);
req.busboy.on('file', async(fieldname, file, filename) => {
    if(filename.filename === undefined || filename.filename === null) {
        return res.render('config', {
            user, 
            err1: true
        })
    }

    fstream = fs.createWriteStream('./handlers/uploads/' + filename.filename);
    file.pipe(fstream);
    fstream.on('close', async() => {
        const a = await client.upload({
            image: fs.createReadStream('./handlers/uploads/' + filename.filename),
            type: 'stream'
        });
        if(a.sucess === true) {
            fs.unlinkSync('./handlers/uploads/' + filename.filename)
            await users.findOneAndUpdate({ token: cookie }, { $set: { avatar: a.data.link } })
        }

        res.redirect('/me')
    });
});

});

module.exports = route;