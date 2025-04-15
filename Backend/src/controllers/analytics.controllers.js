import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { Review } from "../models/review.models.js";

const getSalesOverview = asyncHandler(async (req, res) => {
  const [results] = await Order.aggregate([
    {
      $match: {
        orderStatus: "delivered",
      },
    },
    {
      $group: {
        _id: "salse",
        totalRevenue: {
          $sum: "$finalAmount",
        },
        totalOrders: { $sum: 1 },
        totalCustomers: { $addToSet: "$userId" },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalOrders: 1,
        totalCustomers: { $size: "$totalCustomers" },
        avgOrderValue: {
          $cond: [
            { $eq: ["$totalOrders", 0] },
            0,
            { $divide: ["$totalRevenue", "$totalOrders"] },
          ],
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        results || {},
        "Salse overview data fetched successfully."
      )
    );
});

const getOrderByStatus = asyncHandler(async (req, res) => {
  const results = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Orders by status fetched."));
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const results = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
        orderStatus: "delivered",
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        totalRevenue: { $sum: "$finalAmount" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalRevenue: 1,
        orders: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, results || {}, "Monthly revenue fetched."));
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const results = await Product.aggregate([
    {
      $match: {
        stock: { $lte: 5 },
        isPublished: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        brand: 1,
        category: 1,
        stock: 1,
        price: 1,
        discount: 1,
        isLowStock: { $lte: ["$totalStocks", 5] },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, results || {}, "Fetched low stock products."));
});

const getTopRatedProducts = asyncHandler(async (req, res) => {
  const results = await Review.aggregate([
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $match: {
        reviewCount: { $gte: 1 },
      },
    },
    {
      $sort: {
        avgRating: -1,
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        productId: "$product._id",
        name: "$product.name",
        price: "$product.price",
        images: "$product.images",
        avgRating: 1,
        reviewCount: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, results || {}, "Fetched top rated products."));
});

const getTopSellingProducts = asyncHandler(async (req, res) => {
  const results = await Order.aggregate([
    {
      $match: {
        orderStatus: "delivered",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $group: {
        _id: "$orderItems.productId",
        productName: { $first: "$orderItems.name" },
        productPrice: { $first: "$orderItems.price" },
        totalTimeOrdered: { $sum: 1 },
        totalQuantitySold: { $sum: "$orderItems.quantity" },
      },
    },
    {
      $sort: {
        totalQuantitySold: -1,
        totalTimeOrdered: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        results || {},
        "Successfully fetched top selling products."
      )
    );
});

export {
  getSalesOverview,
  getOrderByStatus,
  getMonthlyRevenue,
  getLowStockProducts,
  getTopRatedProducts,
  getTopSellingProducts,
};
