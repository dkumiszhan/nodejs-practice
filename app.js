const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
    console.log(JSON.stringify(req.url));

    switch (req.url) {
        case '/':
            res.writeHead(200, { 'content-type': 'text/html' });
            fs.createReadStream('./index.html').pipe(res);
            break;
        case '/pages/index.css':
            res.writeHead(200, { 'content-type': 'text/css' });
            fs.createReadStream('./pages/index.css').pipe(res);
            break;
        case '/vendor/normalize.css':
            res.writeHead(200, { 'content-type': 'text/css' });
            fs.createReadStream('./vendor/normalize.css').pipe(res);
            break;
        case '/header/__title/header__title.css':
            res.writeHead(200, { 'content-type': 'text/css' });
            fs.createReadStream('./header/__title/header__title.css').pipe(res);
            break;
        case '/public/script.js':
            res.writeHead(200, { 'content-type': 'text/javascript' });
            fs.createReadStream('./public/script.js').pipe(res);
            break;
        default:
            res.writeHead(404);
            res.end('not found');
            break;
    }



});

const io = new Server(server, {
    serveClient: true
});

io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
    let x = 1;
    setInterval(function () {
        socket.emit('new-number', x);
        x = x % 10 + 1;
    }, 1000);


    // receive a message from the client
    socket.on("hello from client", (...args) => {
        // ..
        console.log('received hello from client: ' + JSON.stringify(args));
    });
});

server.listen(process.env.PORT || 3000);
