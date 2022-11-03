const { readdirSync } = require("fs")

module.exports = async (app) => {
    let path = readdirSync('./posts').filter(x => x.endsWith('.js'))

    for (let file of path) {
        let pull = require(`../posts/${file}`);

        pull.page = pull.page || file.replace('.js', '');
        

        app.post(`/${pull.page}`, async (req, res) => { pull.run(req, res) });
        
    }
}