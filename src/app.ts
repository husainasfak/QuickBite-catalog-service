import config from "config";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";
import toppingRouter from "./topping/topping-router";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const ALLOWED_DOMAINS: string[] = [
    config.get("frontend.clientUI"),
    config.get("frontend.adminUI"),
];
app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cors({
        origin: ALLOWED_DOMAINS,
    }),
);

app.use(express.json());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
    res.json({
        msg: config.get("server.port"),
    });
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/toppings", toppingRouter);
app.use(globalErrorHandler);

export default app;
