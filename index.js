const express = require('express'),
app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');
app.use(express.static(__dirname + '/pages/static'));

app.get('/', async(req, res) => res.send('ok'))

app.listen(80, async() => console.log('site online'))