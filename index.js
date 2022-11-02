const express = require('express'),
app = express();

app.get('/', async(req, res) => res.send('ok'))

app.listen(80, async() => console.log('site online'))