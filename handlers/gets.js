const { readdirSync } = require("fs")

module.exports = async (app, recaptcha) => {
    let path = readdirSync('./gets').filter(x => x.endsWith('.js'))

    for (let file of path) {
        let pull = require(`../gets/${file}`);

        pull.page = pull.page || file.replace('.js', '');
        
        app.get('/', (req, res) => res.redirect('/home'));
        app.get(`/${pull.page}`, recaptcha.middleware.render, async (req, res) => { pull.run(req, res) });
        
    }
}