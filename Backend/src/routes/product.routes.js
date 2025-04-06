import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getNewArrivals,
  getProductById,
  getSimilarProducts,
  updateProductDetails,
  updateProductImages,
} from "../controllers/product.controllers.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    authorizeRoles("admin"),
    upload.array("images", 3),
    createProduct
  );

router.route("/all-products").get(getAllProducts);

router.route("/new-arrivals").get(getNewArrivals);

router.route("/:id").get(getProductById);

router.route("/similar-products/:id").get(getSimilarProducts);

router
  .route("/update/:id")
  .put(verifyJWT, authorizeRoles("admin"), updateProductDetails);

router
  .route("/update-images/:id")
  .put(
    verifyJWT,
    authorizeRoles("admin"),
    upload.array("images", 3),
    updateProductImages
  );

router
  .route("/delete/:id")
  .delete(verifyJWT, authorizeRoles("admin"), deleteProduct);

export default router;
