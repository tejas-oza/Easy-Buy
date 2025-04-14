import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { Coupon } from "../models/coupon.models.js";
import { Product } from "../models/product.models.js";
import mongoose from "mongoose";
import { Cart } from "../models/cart.models.js";

const placeOrder = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { shippingAddress, paymentMethod, razorpayDetail, couponCode } =
    req.body;

  const cart = await Cart.findOne({ userId: user });

  if (!cart || cart.cartItems.length <= 0) {
    throw new ApiError(400, "Yoru cart is empty.");
  }

  let discount = 0;
  let couponDetails = null;
  let coupon;

  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      throw new ApiError(404, "Invalid or expired coupon.");
    }

    if (coupon?.expirationDate < new Date()) {
      throw new ApiError(400, "Coupon has expired.");
    }

    if (coupon?.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new ApiError(400, "Coupon usages limit exceeded.");
    }

    if (coupon?.discountType === "percentage") {
      discount = (cart?.totalPrice * coupon?.discountValue) / 100;
    } else if (coupon?.discountType === "fixed") {
      discount = coupon?.discountValue;
    }

    couponDetails = {
      code: coupon?.code,
      discountType: coupon?.discountType,
      discountValue: coupon?.discountValue,
      appliedValue: discount,
    };
  }

  const orderItems = [...cart?.cartItems];
  const actualAmount = cart?.totalPrice;
  const shippingCharges = actualAmount <= 500 ? 50 : 0;
  const finalAmount = actualAmount - discount + shippingCharges;

  const order = await Order.create({
    userId: user,
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
    razorpayDetail: paymentMethod === "razorpay" ? razorpayDetail : {},
    couponDetails,
    actualAmount,
    shippingCharges,
    finalAmount,
    orderStatus: "confirmed",
  });

  if (!order) {
    throw new ApiError(500, "Something went wrong while placing order.");
  }

  coupon.usageCount += 1;
  await coupon.save();

  for (const item of order?.orderItems) {
    const product = await Product.findById(item?.productId);

    if (product) {
      product.stock -= item.quantity;
    }

    if (product.stock <= 0) {
      product.stock = 0;
    }

    await product.save();
  }

  cart.cartItems = [];
  cart.totalPrice = 0;
  await cart.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order placed successfully."));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const user = req?.user?._id;

  const myOrders = await Order.find({ userId: user });

  if (!myOrders || myOrders.length <= 0) {
    throw new ApiError(
      404,
      "You haven't placed any orders. Place an order to see them here."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { myOrders }, "All orders retrived successfully,")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid order ID.");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { order }, "Order detail fetched successfully.")
    );
});

const cancleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid order ID.");
  }

  const cancledOrder = await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        orderStatus: "cancelled",
      },
    },
    {
      new: true,
    }
  );

  if (!cancledOrder) {
    throw new ApiError(
      500,
      "Something went wrong while cancling the order. Please try again later."
    );
  }

  for (const item of cancledOrder.orderItems) {
    const product = await Product.findById(item?.productId);

    if (product) {
      product.stock += item.quantity;
    }

    await product.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { cancledOrder }, "Order cancelled successfully.")
    );
});

// admin controllers

const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find({});

  if (!allOrders) {
    throw new ApiError(404, "No order is yet confirmed.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { allOrders }, "All orders fetched successfully.")
    );
});

// beginner level
// const updateOrderStatus = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Provide valid order ID.");
//   }

//   const order = await Order.findById(id).select("orderStatus");

//   if (!order) {
//     throw new ApiError(404, "Order not found or already deleted.");
//   }

//   if (order.orderStatus === "confirmed") {
//     order.orderStatus = "shipped";
//   } else if (order.orderStatus === "shipped") {
//     order.orderStatus = "delivered";
//     order.paymentStatus = "paid";
//   }

//   await order.save();

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, { order }, "Order status updated successfully.")
//     );
// });

// senior level
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Please provide a valid order ID.");
  }

  const order = await Order.findById(id).select("orderStatus paymentStatus");

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const currentStatus = order.orderStatus;
  let nextStatus = null;

  // Define valid status transitions
  const statusFlow = {
    confirmed: "shipped",
    shipped: "delivered",
  };

  // Determine the next status based on current status
  if (statusFlow[currentStatus]) {
    nextStatus = statusFlow[currentStatus];
  } else {
    throw new ApiError(
      400,
      `Order cannot be updated from '${currentStatus}' status.`
    );
  }

  // Apply the status change
  order.orderStatus = nextStatus;

  // Auto-update payment status if needed
  if (nextStatus === "delivered") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { order }, "Order status updated successfully.")
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid order ID.");
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found or already deleted.");
  }

  if (["delivered", "cancelled"].includes(order.orderStatus)) {
    throw new ApiError(400, "Delivered or cancelled orders cannot be deleted.");
  }

  await order.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order deleted successfully."));
});

export {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancleOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
