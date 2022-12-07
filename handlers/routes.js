const { readdirSync } = require('fs');

module.exports = async (app) => {
    let path = readdirSync('./routes/').filter(x => x.endsWith('.js'));
    for (let file of path) {
        let route = require(`../routes/${file}`)
        let routePath = file === 'index.js' ? '/' : `/${file.slice(0, -3)}`

        app.use(routePath, route);
    }
}
