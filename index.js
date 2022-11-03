require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    Recaptcha = require('express-recaptcha').RecaptchaV2,
    recaptcha = new Recaptcha(process.env.siteKey, process.env.secretKey),
    passport = require('passport'),
    discordStrategy = require('passport-discord').Strategy,
    session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');
app.set('trust proxy', 1);
app.use(express.static(__dirname + '/pages/static'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: '_CeAuycgK36L9ge4KMLjgkvO9GCZnlv3',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(passport.session());
app.use(passport.initialize());

for (let x of ['gets', 'posts']) require(`./handlers/${x}`)(app, recaptcha);

passport.use(new discordStrategy({
    clientID: '1037834650091012298',
    clientSecret: '_CeAuycgK36L9ge4KMLjgkvO9GCZnlv3',
    callbackURL: 'https://localhost/auth/discord/callback',
    scope: ['identify', 'email']
}, function (accessToken, refreshToken, profile, cb) {
    return cb("", profile);
}))

app.get('/auth/discord', passport.authenticate('discord'))
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    res.send('ok') // Successful auth
});
app.get('*', (req, res) => res.render('404'));

app.listen(80, async () => console.log('site online'))
mongoose.connect(process.env.mongoUrl, () => console.log('database online'))