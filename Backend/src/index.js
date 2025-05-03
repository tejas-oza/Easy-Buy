import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { expireCouponsCron } from "./utils/expireCoupons.cron.js";

dotenv.config({
  path: "./.env",
});

import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

expireCouponsCron();

// 404 route
app.use((req, res) => {
  return res.status(404).json(new ApiResponse(404, {}, "Route not found."));
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
