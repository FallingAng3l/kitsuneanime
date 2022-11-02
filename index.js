const express = require('express'),
app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');
app.use(express.static(__dirname + '/pages/static'));

for(let x of ['gets']) require(`./handlers/${x}`)(app);

app.listen(80, async() => console.log('site online'))