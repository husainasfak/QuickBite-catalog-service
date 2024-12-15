import config from "config";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({
        msg: config.get("server.port"),
    });
});

app.use(globalErrorHandler);

export default app;
