const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(JSON.stringify(req.url));
    if (req.url == '/') {
        res.writeHead(200, { 'content-type': 'text/html' });
        fs.createReadStream('./index.html').pipe(res);
    }
    else if (req.url == '/pages/index.css') {
        res.writeHead(200, { 'content-type': 'text/css' });
        fs.createReadStream('./pages/index.css').pipe(res);
    } 
    else if (req.url == '/vendor/normalize.css') {
        res.writeHead(200, { 'content-type': 'text/css' });
        fs.createReadStream('./vendor/normalize.css').pipe(res);
    }
    else if (req.url == '/header/__title/header__title.css') {
        res.writeHead(200, { 'content-type': 'text/css' });
        fs.createReadStream('./header/__title/header__title.css').pipe(res);
    }
    else {
        res.writeHead(404);
        res.end('not found');
    }

})

server.listen(process.env.PORT || 3000);