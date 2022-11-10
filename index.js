require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    Recaptcha = require('express-recaptcha').RecaptchaV2,
    recaptcha = new Recaptcha(process.env.siteKey, process.env.secretKey);

global.recaptcha = recaptcha;

app.set('view engine', 'pug');
app.set('views', __dirname + '/pages');
app.use(express.static(__dirname + '/pages/static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

for (let x of ['routes']) require(`./handlers/${x}`)(app);

app.listen('80', () => console.log('Site Online'));
mongoose.connect(process.env.mongoUrl, () => console.log('Database Online'))