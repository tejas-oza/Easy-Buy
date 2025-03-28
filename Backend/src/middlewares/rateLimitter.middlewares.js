import { rateLimit } from "express-rate-limit";

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes
  limit: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export { apiRateLimiter, authRateLimiter };
