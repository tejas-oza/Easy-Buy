import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createCoupon,
  getCouponById,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("admin"), createCoupon);
router.route("/").get(verifyJWT, getAllCoupons);
router.route("/:id").get(verifyJWT, getCouponById);
router
  .route("/:id/update")
  .put(verifyJWT, authorizeRoles("admin"), updateCoupon);

router
  .route("/:id/delete")
  .delete(verifyJWT, authorizeRoles("admin"), deleteCoupon);

export default router;
