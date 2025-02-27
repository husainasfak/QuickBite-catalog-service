import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { asyncWrapper } from "../common/utils/wrapper";
import ProductController from "./product-controller";
import { Roles } from "../common/constants";
import productValidator from "./product-validator";
import ProductService from "./product-service";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";
import updateProductValidator from "./update-product-validator";
import { createMessageProducerBroker } from "../common/factories/brokerFactory";
const router = express.Router();
const productService = new ProductService();
const s3Storage = new S3Storage();
const broker = createMessageProducerBroker();
const productController = new ProductController(
    productService,
    s3Storage,
    broker,
);
router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1014 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    productValidator,
    asyncWrapper(productController.create),
);

router.put(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1014 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    updateProductValidator,
    asyncWrapper(productController.update),
);
router.get("/", asyncWrapper(productController.getAll));

export default router;
