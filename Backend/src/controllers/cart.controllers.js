import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";
import mongoose from "mongoose";

const addToCart = asyncHandler(async (req, res) => {
  const { id, quantity, color, size } = req.body;
  const user = req.user?._id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Product id is not valid.");
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const finalPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  let cart = await Cart.findOne({ userId: user });

  if (!cart) {
    cart = await Cart.create({
      userId: user,
      cartItems: [
        {
          productId: id,
          name: product?.name,
          quantity,
          price: finalPrice,
          color: color,
          size: size,
        },
      ],
      totalPrice: quantity * finalPrice,
    });
  } else {
    const productIndex = cart.cartItems.findIndex((item) =>
      item.productId.equals(id)
    );

    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += quantity;
    } else {
      cart.cartItems.push({
        productId: id,
        name: product?.name,
        quantity,
        price: finalPrice,
        color: color,
        size: size,
      });
    }

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  await cart.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, { cart }, "Product added to the cart successfully")
    );
});

const getCart = asyncHandler(async (req, res) => {
  const user = req.user?._id;

  const cart = await Cart.findOne({ userId: user }).populate(
    "cartItems.productId",
    "name price discount images"
  );

  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "Cart retrived successfully."));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user?._id;

  let cart = await Cart.findOne({ userId: user });

  if (!cart) {
    throw new ApiError(404, "Cart not found.");
  }

  cart.cartItems = cart.cartItems.filter((item) => !item.productId.equals(id));

  cart.totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { cart }, "Product removed from cart successfully.")
    );
});

export { addToCart, getCart, removeFromCart };
