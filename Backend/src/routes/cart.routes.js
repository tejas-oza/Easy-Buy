import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("customer"), addToCart);

router.route("/").get(verifyJWT, authorizeRoles("customer"), getCart);

router
  .route("/:id")
  .delete(verifyJWT, authorizeRoles("customer"), removeFromCart);

export default router;
