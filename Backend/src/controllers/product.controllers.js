import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    category,
    brand,
    price,
    discount,
    stock,
    weight,
    shippingCost,
    returnPolicy,
    warranty,
  } = req.body;
});
