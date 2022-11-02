require('dotenv').config();
const express = require('express'),
app = express(),
mongoose = require('mongoose'),
cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');
app.use(express.static(__dirname + '/pages/static'));
app.use(cookieParser());

for(let x of ['gets']) require(`./handlers/${x}`)(app);

app.listen(80, async() => console.log('site online'))
mongoose.connect(process.env.mongoUrl, () => console.log('database online'))