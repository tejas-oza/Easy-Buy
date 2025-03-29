import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import { addBrand, deleteBrand } from "../controllers/brand.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, authorizeRoles("admin"), upload.single("logo"), addBrand);
router.route("/:id").delete(verifyJWT, authorizeRoles("admin"), deleteBrand);

export default router;
