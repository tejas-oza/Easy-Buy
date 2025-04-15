import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middlewares.js";
import {
  getMonthlyRevenue,
  getOrderByStatus,
  getSalesOverview,
  getLowStockProducts,
  getTopRatedProducts,
  getTopSellingProducts,
} from "../controllers/analytics.controllers.js";

const router = Router();

router
  .route("/sales-overview")
  .get(verifyJWT, authorizeRoles("admin"), getSalesOverview);

router
  .route("/order-by-status")
  .get(verifyJWT, authorizeRoles("admin"), getOrderByStatus);

router
  .route("/monthly-revenue")
  .get(verifyJWT, authorizeRoles("admin"), getMonthlyRevenue);

router
  .route("/low-stock")
  .get(verifyJWT, authorizeRoles("admin"), getLowStockProducts);

router
  .route("/top-rated-products")
  .get(verifyJWT, authorizeRoles("admin"), getTopRatedProducts);

router
  .route("/top-selling-products")
  .get(verifyJWT, authorizeRoles("admin"), getTopSellingProducts);

export default router;
