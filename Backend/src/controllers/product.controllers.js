import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { Brand } from "../models/brand.models.js";
import mongoose from "mongoose";
import fs from "fs";

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

  if (
    !name ||
    !slug ||
    !description ||
    !category ||
    !brand ||
    !price ||
    !stock
  ) {
    throw new ApiError(
      400,
      "Missing required fields: name, slug, description, category, brand, price, or stock."
    );
  }

  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    throw new ApiError(400, `Product with slug ${slug} already exists.`);
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one product image required");
  }

  if (
    !mongoose.Types.ObjectId.isValid(category) ||
    !mongoose.Types.ObjectId.isValid(brand)
  ) {
    throw new ApiError(
      400,
      "Category Id or Brand Id are not valid mongoose Id."
    );
  }

  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new ApiError(
      404,
      "Category not found. Please provide a valid category ID."
    );
  }

  const existingBrand = await Brand.findById(brand);
  if (!existingBrand) {
    throw new ApiError(
      404,
      "Brand not found. Please provide a valid brand ID."
    );
  }

  let productImages = req.files.map((file) => file.path);

  let productDimensions = {};

  let productTags = [];

  try {
    if (req.body.dimensions) {
      productDimensions = JSON.parse(req.body.dimensions);
    }
    if (req.body.tags) {
      productTags = JSON.parse(req.body.tags);
    }
  } catch (error) {
    throw new ApiError(
      400,
      "Invalid JSON format in dimensions, variants, or tags."
    );
  }

  const product = await Product.create({
    name,
    slug,
    description,
    category,
    brand,
    price,
    discount,
    stock,
    weight,
    images: productImages,
    dimensions: productDimensions,
    shippingCost,
    returnPolicy,
    tags: productTags,
    warranty,
  });

  if (!product) {
    throw new ApiError(
      500,
      "Failed to create product. Please try again later."
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product added successfully."));
});

const getAllProducts = asyncHandler(async (req, res) => {
  let { limit = 10, page = 1, search } = req.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  let skip = (page - 1) * limit;

  let filter = {};

  if (search) {
    filter = { $text: { $search: search } };
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("category brand", "name"),
    Product.countDocuments(filter),
  ]);

  if (!products || !products.length === 0) {
    throw new ApiError(404, "No products found.");
  }

  let totalPages = Math.ceil(totalProducts / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          totalProducts,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Product retrived successfully."
    )
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Please provide valid product ID.");
  }

  const product = await Product.findById(id).populate("category brand", "name");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully."));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateFields = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid product ID.");
  }

  // Ensure tags are unique if updating
  if (updateFields.tags && Array.isArray(updateFields.tags)) {
    updateFields.tags = [...new Set(updateFields.tags)];
  }

  // Handle dimensions update properly
  if (updateFields.dimensions) {
    updateFields.dimensions = {
      length: updateFields.dimensions.length || 0,
      width: updateFields.dimensions.width || 0,
      height: updateFields.dimensions.height || 0,
    };
  }

  // Handle variants properly
  // if (updateFields.variants) {
  //   const newVariant = updateFields.variants.map((variant) => ({
  //     color: variant.color,
  //     size: variant.size,
  //     price: variant.price,
  //   }));
  //   console.log(updateFields.variants);

  //   console.log(newVariant);

  //   updateFields.variants = [...product.variants, newVariant];
  // }

  // Find and update product
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product: updatedProduct },
        "Product updated successfully."
      )
    );
});

const updateProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid product ID.");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  let imagesToUpdate = [];
  imagesToUpdate = JSON.parse(req.body.removeImages);

  if (imagesToUpdate && Array.isArray(imagesToUpdate)) {
    product.images = product.images.filter((img) => {
      if (imagesToUpdate.includes(img)) {
        const imagePath = img;

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        return false; // Remove from array
      }
      return true; // Keep in array
    });
  }

  if (req.files || req.files.length > 0) {
    const newImages = req.files.map((img) => img.path);
    product.images.push(...newImages);
  }

  await product.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { images: product.images },
        "Product images updated successfully."
      )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Provide valid product ID.");
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found or already deleted.");
  }

  if (deletedProduct.images && deletedProduct.images.length > 0) {
    await Promise.all(
      deletedProduct.images.map(async (img) => {
        const imagePath = img;
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath); // Asynchronous, non-blocking delete
        }
      })
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedProduct },
        `Product ${deletedProduct?.name} deleted successfully.`
      )
    );
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductDetails,
  deleteProduct,
  updateProductImages,
};
