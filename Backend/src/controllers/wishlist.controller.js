import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.models.js";
import mongoose from "mongoose";

const addToWishList = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request.");
  }

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }

  // Check if product exists before adding to wishlist
  const productExists = await Product.exists({ _id: productId });
  if (!productExists) {
    throw new ApiError(404, "Product not found.");
  }

  // Check if product is already in the wishlist
  const wishlistItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  }).lean();

  if (wishlistItem) {
    throw new ApiError(400, "Product is already in your wishlist.");
  }

  // Add product to wishlist
  const wishlistProduct = await Wishlist.create({
    user: userId,
    product: productId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { wishlistProduct },
        "Product wishlist successfully."
      )
    );
});

const removeFromWishList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user?._id;

  if (!user) {
    throw new ApiError(401, "Unauthorized request.");
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Product id is not valid.");
  }

  const isProductWishlisted = await Wishlist.exists({
    user: user,
    product: id,
  });

  if (!isProductWishlisted) {
    throw new ApiError(404, "Product is not wishlisted.");
  }

  const product = await Wishlist.findOneAndDelete({
    user: user,
    product: id,
  });

  if (!product) {
    throw new ApiError(500, "Problem while removing wishlisted product.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product removed from wishlist."));
});

export { addToWishList, removeFromWishList };
