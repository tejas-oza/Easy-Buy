import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  cancleOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("customer"), placeOrder);

router.route("/").get(verifyJWT, authorizeRoles("customer"), getMyOrders);

router
  .route("/order-detail/:id")
  .get(verifyJWT, authorizeRoles("admin", "customer"), getOrderById);

router
  .route("/:id/cancle")
  .put(verifyJWT, authorizeRoles("customer"), cancleOrder);

// admin only

router
  .route("/all-orders")
  .get(verifyJWT, authorizeRoles("admin"), getAllOrders);

router
  .route("/:id/update-status")
  .put(verifyJWT, authorizeRoles("admin"), updateOrderStatus);

router
  .route("/:id/delete")
  .delete(verifyJWT, authorizeRoles("admin"), deleteOrder);
export default router;
