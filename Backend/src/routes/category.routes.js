import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("admin"), createCategory);

router.route("/:id").delete(verifyJWT, authorizeRoles("admin"), deleteCategory);

export default router;
