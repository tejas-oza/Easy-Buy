import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("admin"), createCategory);

router.route("/").get(getAllCategories);

router.route("/:id").get(verifyJWT, getCategoryById);

router.route("/:id").put(verifyJWT, authorizeRoles("admin"), updateCategory);

router.route("/:id").delete(verifyJWT, authorizeRoles("admin"), deleteCategory);

export default router;
