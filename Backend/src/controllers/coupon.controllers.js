import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coupon } from "../models/coupon.models.js";
import { Cart } from "../models/cart.models.js";
import mongoose from "mongoose";

const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    expirationDate,
    usageLimit,
    isActive,
  } = req.body;

  if (
    !code &&
    !discountType &&
    !discountValue &&
    !expirationDate &&
    !usageLimit &&
    !isActive
  ) {
    throw new ApiError(400, "All fields required.");
  }

  const existingCoupon = await Coupon.exists({
    code: code.trim().toUpperCase(),
  });

  if (existingCoupon) {
    throw new ApiError(400, `Coupon ${code} already exists.`);
  }

  const coupon = await Coupon.create({
    code,
    discountType,
    discountValue,
    expirationDate,
    usageLimit,
    isActive,
  });

  if (!coupon) {
    throw new ApiError(500, "Something went wrong while creating coupon.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { coupon }, `Coupon ${code} created successfully.`)
    );
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const filter = search ? { $text: { $search: search } } : {};

  // if (search) {
  //   ;
  // }

  const allCoupons = await Coupon.find(filter).sort({ createdAt: -1 });

  if (!allCoupons || allCoupons.length <= 0) {
    throw new ApiError(404, "No coupons found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { allCoupons }, "Coupons retrived successfully.")
    );
});

const getCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid coupon id.");
  }

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { coupon }, "Coupon fetched successfully."));
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid coupon id.");
  }

  const {
    code,
    discountType,
    discountValue,
    expirationDate,
    usageLimit,
    isActive,
  } = req.body;

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    id,
    {
      $set: {
        code: code,
        discountType: discountType,
        discountValue: discountValue,
        expirationDate: expirationDate,
        usageLimit: usageLimit,
        isActive: isActive,
      },
    },
    { new: true }
  );

  if (!updatedCoupon) {
    throw new ApiError(500, "Coupon not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedCoupon }, "Coupon updated successfully.")
    );
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid coupon id.");
  }

  const deletedCoupon = await Coupon.findByIdAndDelete(id);

  if (!deletedCoupon) {
    throw new ApiError(404, "Coupon not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Coupon deleted successfully."));
});

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
