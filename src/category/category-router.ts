import express from "express";
import { CategoryController } from "./category-controller";

import logger from "../config/logger";
import { asyncWrapper } from "../common/utils/wrapper";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import categoryUpdateValidator from "./category-update-validator";

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.create),
);

router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryUpdateValidator,
    asyncWrapper(categoryController.update),
);

router.get("/", asyncWrapper(categoryController.gatAll));
router.get("/:categoryId", asyncWrapper(categoryController.getOne));

export default router;