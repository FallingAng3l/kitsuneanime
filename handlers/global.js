module.exports = async (recaptcha, client, email) => {
    global.recaptcha = recaptcha;
    global.client = client;
    global.remetente = email.createTransport({
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        tls: {
            ciphers: 'SSLv3'
        },
        port: '587',
        auth: {
            user: process.env.email,
            pass: process.env.pwd
        }
    }); 
}