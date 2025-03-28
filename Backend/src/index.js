import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { ApiResponse } from "./utils/ApiResponse.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 4000;

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
