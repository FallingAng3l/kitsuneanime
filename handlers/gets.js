const { readdirSync } = require("fs")

module.exports = async (app) => {
    let path = readdirSync('./gets').filter(x => x.endsWith('.js'))

    for (let file of path) {
        let pull = require(`../gets/${file}`);

        pull.page = pull.page || file.replace('.js', '');
        
        app.get('/', (req, res) => res.redirect('/home'));
        app.get(`/${pull.page}`, async (req, res) => { pull.run(req, res) });
    }
}