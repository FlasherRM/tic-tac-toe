import IController from "../interfaces/controller.interface";
import * as express from "express";
import RoomService from "../services/room.service";

export default class XoController implements IController {
    public path: string = '';
    public router = express.Router();
    public service = new RoomService();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path + "/create-room", this.createRoom);
        this.router.get(this.path + "/room/:id", this.showRoom);
    }

    createRoom = async (request: express.Request, response: express.Response): Promise<any | boolean> => {
        const id = this.service.createRoom(request.cookies)
        response.redirect('http://localhost:3000/room/' + id)
    }

    showRoom = async (request: express.Request, response: express.Response): Promise<any | boolean> => {
        let room: any = await this.service.showRoom(request.params.id);
        let firstTurn = true

        if (room.firstToken != request.cookies?.guest_token) {
            room = await this.service.getSecondPlayerToRoom(room.id, request.cookies?.guest_token)
            firstTurn = false
        }

        response.render('game', {room, firstTurn})
    }

}