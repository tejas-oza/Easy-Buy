import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized request.");
  }
});

// ! don't use asyncHandler function for suthorizeRoles middleware
// const authorizeRoles = asyncHandler(async (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user?.role)) {
//       throw new ApiError(403, "Access denied.");
//     }
//     next();
//   };
// });

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }
    next();
  };
};

export { verifyJWT, authorizeRoles };
