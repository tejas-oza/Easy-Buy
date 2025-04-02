import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "../controllers/brand.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, authorizeRoles("admin"), upload.single("logo"), addBrand);

router.route("/").get(getAllBrands);

router.route("/:id").get(verifyJWT, getBrandById);

router.route("/:id").put(verifyJWT, authorizeRoles("admin"), updateBrand);

router.route("/:id").delete(verifyJWT, authorizeRoles("admin"), deleteBrand);

export default router;
