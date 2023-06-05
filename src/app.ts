import express from 'express'
import http from 'http';
import IController from "./interfaces/controller.interface";
import {Server} from "socket.io";
import cookieParser from "cookie-parser";
import * as bodyParser from 'body-parser';
import cookiesMiddleware from './middleware/cookies.middleware';
import path from "path";
import SocketService from "./services/socket.service";
import RoomService from "./services/room.service";


export default class App {
    public app: express.Application;
    private readonly port: number | string;
    private server: any;
    public io: Server;
    public socketService = new SocketService();

    constructor(controllers: IController[], port: string | number) {
        this.app = express();
        this.port = port;
        this.server = http.createServer(this.app);

        this.initializeMiddlewares()
        this.initializeControllers(controllers)
    }

    public listen(): this {
        const server = this.app.listen(this.port, () => {
            console.log(`Server is running on http://0.0.0.0:${this.port}`);
        });

        this.initializeSocketServer(server);

        return this;
    }

    public listenSocket() {
            this.io.on('connection', (socket) => {
                socket.on('playerMove', async (data) => {
                    socket.emit('enemy moved', await this.socketService.move(data))
                })
            })
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach(async (controller: IController) => {
            await this.app.use('/', controller.router);
        });
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.set('view engine', 'ejs')
        // this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.static('public'))
        this.app.use(cookieParser());
        this.app.use(cookiesMiddleware());
    }

    private initializeSocketServer(server: http.Server) {
        this.io = new Server(server, { cors: { origin: "*" } }); // Allow all
    }

}