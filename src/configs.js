module.exports = {
    server: {
        port: 40004, // Server Port
        sslPort: undefined // Server Port
    },
    enableSSL: false,
    endpoint: {
        host: 'localhost', // Enter here the target host. Example: server1.com
        port: 8080 // Server Port 
    },
    whitelistApis: [],
    continueWithInvalidJson: false, 
    passAPIOnFailure: false
}
