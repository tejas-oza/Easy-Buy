import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addToWishList,
  removeFromWishList,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/:id").post(verifyJWT, authorizeRoles("customer"), addToWishList);
router
  .route("/:id")
  .delete(verifyJWT, authorizeRoles("customer"), removeFromWishList);

export default router;
