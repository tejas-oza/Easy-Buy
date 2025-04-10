import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addReview,
  deletereview,
  getReviewByProduct,
  getReviewByUser,
  updateReview,
} from "../controllers/review.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("customer"), addReview);

router.route("/:id").get(getReviewByProduct);

router.route("/").get(verifyJWT, authorizeRoles("customer"), getReviewByUser);

router
  .route("/:id/update")
  .put(verifyJWT, authorizeRoles("customer"), updateReview);

router
  .route("/:id/delete")
  .delete(verifyJWT, authorizeRoles("customer"), deletereview);

export default router;
