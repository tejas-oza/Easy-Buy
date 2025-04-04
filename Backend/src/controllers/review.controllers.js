import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.models.js";
import { Product } from "../models/product.models.js";
import mongoose from "mongoose";

const addReview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { productId, comment, rating } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product Id required.");
  }

  const review = await Review.create({
    user: user?._id,
    product: productId,
    comment: comment,
    rating: rating,
  });

  if (!review) {
    throw new ApiError(500, "Faild to add review. Please try again later.");
  }

  const product = await Product.findById(productId);

  product.reviews.push(review);
  await product.save();
  return res
    .status(201)
    .json(new ApiResponse(201, { review }, "Review add successfully."));
});

const getReviewByProduct = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.body;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let skip = (page - 1) * limit;
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid product ID.");
  }

  const reviews = await Review.find({ product: id })
    .skip(skip)
    .limit(limit)
    .sort({ createAt: -1 })
    .populate("user", "username email");

  if (!reviews || reviews.length <= 0) {
    throw new ApiError(404, "No reviews found for this product.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { reviews }, "All reviews fetched successfully.")
    );
});

const getReviewByUser = asyncHandler(async (req, res) => {
  const user = req.user;

  const reviews = await Review.find({ user: user?._id }).populate(
    "product",
    "name description price images"
  );

  if (!reviews || reviews.lenght <= 0) {
    throw new ApiError(404, "User havent reviewed any products.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reviews }, "Reviews retrived successfully."));
});

const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  const user = req.user;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid review ID.");
  }

  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  if (!review.user.equals(user._id)) {
    throw new ApiError(
      403,
      "You do not have permission to update this review."
    );
  }

  review.comment = comment ?? review.comment;
  review.rating = rating ?? review.rating;

  await review.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { review }, "Review updated successfully."));
});

const deletereview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid review ID.");
  }

  const review = await Review.findById(id);

  if (!review.user.equals(user?._id)) {
    throw new ApiError(401, "You have no permission to delete this review.");
  }

  await review.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully."));
});

export {
  addReview,
  getReviewByProduct,
  getReviewByUser,
  updateReview,
  deletereview,
};
