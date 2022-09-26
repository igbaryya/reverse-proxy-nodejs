const axios = require('axios');
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const config = require('./configs');

/**
 * @param {Object} request HTTP Request
 * @param {Object} response HTTP Response
 */
function pipeRequest(req, res, next) {
    let path = req.url;
    const endpoint = `${config.endpoint.host}:${config.endpoint.port}`;
    axios({
        method: req.method,
        url: `http://${endpoint}${path}`,
        responseType: 'stream',
        data: req.body,
        headers: req.headers
    }).then(function(response) {
        response.data.pipe(res);
        res.writeHead(response.status, response.headers)
        next();
    }).catch((err) => {
        console.error(`[ERROR]: Failed for http://${endpoint}${path}`, new Error(err).message);
        if (err.response) {
            err.response.data.pipe(res, { end: true });
            res.writeHead(err.response.status, err.response.headers)
            next();
        } else {
            console.error(`[ERROR] FAILED TO EXECUTE SERVER REST http://${endpoint}${req.url}`);
            next();
        }
    });

}
app.use((req, res, next) => {
    pipeRequest(req, res, next);
}); 


if (config.enableSSL) {
    const options = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    };
    https.createServer(options).listen(config.server.sslPort || config.server.port);
} else {
    app.listen(config.server.port);
}
