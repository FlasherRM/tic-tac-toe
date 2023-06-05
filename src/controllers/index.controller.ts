import IController from "../interfaces/controller.interface";
import * as express from 'express';
import path from 'path';

export default class IndexController implements IController {
    public path: string = '';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.index);
        this.router.get("*", this.notFound);
    }

    index = async (request: express.Request, response: express.Response) => {
        // const filePath = path.join(__dirname, '../../public', 'game.html');
        // response.sendFile(filePath)
        response.render("index");
    }

    notFound = (request: express.Request, response: express.Response) => {
        response.render('404');
    }
}