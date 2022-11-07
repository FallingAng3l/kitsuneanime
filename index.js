const session = require('express-session');

require('dotenv').config();
require('./strategies/discord')
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    Recaptcha = require('express-recaptcha').RecaptchaV2,
    recaptcha = new Recaptcha(process.env.siteKey, process.env.secretKey),
    passport = require('passport'),
    discordStrategy = require('passport-discord').Strategy;

app.set('view engine', 'pug');
app.set('views', __dirname + '/pages');
app.use(express.static(__dirname + '/pages/static'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'JHGSDGYUAKSJDB1235486543HGASD',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 24 * 7}
}));
app.use(passport.initialize());
app.use(passport.session());

for (let x of ['gets', 'posts']) require(`./handlers/${x}`)(app, recaptcha);

app.get('/discord', passport.authenticate('discord'), async(req, res) => {
    res.sendStatus(200)
});

app.get('/discord/redirect', passport.authenticate('discord'), async(req, res) => {
    res.send('sucesso!')
});

app.get('*', (req, res) => res.render('404'));

app.listen(80, async () => console.log('site online'));
mongoose.connect(process.env.mongoUrl, () => console.log('database online'));