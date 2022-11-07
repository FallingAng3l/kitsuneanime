const { Strategy } = require('passport-discord'),
    passport = require('passport');

passport.use(new Strategy({
    clientID: process.env.clientId,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.discordRedirect,
    scope: ['identify', 'email']
}, async (acessToken, refreshToken, profile, cb) => {

}))