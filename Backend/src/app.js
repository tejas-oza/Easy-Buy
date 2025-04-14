import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middlewares.js";
import {
  apiRateLimiter,
  authRateLimiter,
} from "./middlewares/rateLimitter.middlewares.js";

const app = express();

// api rate limiter
app.use("/api", apiRateLimiter);

// auth rate limiter
app.use("/api/v1/users/login", authRateLimiter);
app.use("/api/v1/users/register", authRateLimiter);

// security middleware

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public/temp"));

app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import brandRouter from "./routes/brand.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import reviewRouter from "./routes/review.routes.js";
import wishlistRouter from "./routes/wishlist.route.js";
import cartRouter from "./routes/cart.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import orderRouter from "./routes/order.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlists", wishlistRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/orders", orderRouter);

app.use(errorHandler);

export { app };
