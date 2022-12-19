const cert = require('../kcert')
module.exports = {
    options: {
        protocol: 'mqtt',
        port: 1003,
        username: 'user',
        password: '123',
        cert: cert
    },
    brokerUrl: 'mqtt://100.100.100.100',
 
}
