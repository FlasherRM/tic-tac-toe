import App from './app';
import IndexController from "./controllers/index.controller";
import XoController from "./controllers/xo.controller";
import appConfig from "./config/app";

const port: string | number = appConfig.port;

const app = new App(
    [
        new XoController(),
        new IndexController(),
    ],
    port
);

app.listen().listenSocket();