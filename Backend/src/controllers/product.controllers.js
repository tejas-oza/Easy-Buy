import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { Brand } from "../models/brand.models.js";
import { Review } from "../models/review.models.js";
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
    dimensions,
    tags,
    colours,
    sizes,
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
  let productColours = [];
  let productSizes = [];
  try {
    if (dimensions) {
      productDimensions = JSON.parse(dimensions);
    }
    if (tags) {
      productTags = JSON.parse(tags);
    }

    if (colours) {
      productColours = JSON.parse(colours);
    }
    if (sizes) {
      productSizes = JSON.parse(sizes);
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
    category: existingCategory?.name,
    brand: existingBrand?.name,
    price,
    discount,
    stock,
    weight,
    colours: productColours,
    sizes: productSizes,
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
  let {
    isPublished = true,
    limit = 10,
    page = 1,
    search,
    sortValue = "des",
    minPrice,
    maxPrice,
    category,
    brand,
  } = req.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  let skip = (page - 1) * limit;

  let filter = {
    isPublished,
  };

  // filter by search
  if (search) {
    filter = { $text: { $search: search } };
  }

  // sort by asc or des
  let sort = {};

  if (sortValue === "asc") {
    sort = { createdAt: 1 };
  } else if (sortValue === "des") {
    sort = { createdAt: -1 };
  }

  // filter by minPrice and maxPrice
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // sort by single category or multiple categories
  if (category) {
    const categories = category.split(",").map((cat) => cat.trim());
    filter.category = { $in: categories };
  }

  if (brand) {
    const brands = brand.split(",").map((b) => b.trim());

    filter.brand = { $in: brands };
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(filter).limit(limit).skip(skip).sort(sort),
    Product.countDocuments(filter),
  ]);

  if (!products || products.length <= 0) {
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
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Product retrived successfully."
    )
  );
});

const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(8);

  if (!products || products.length <= 0) {
    throw new ApiError(404, "Products not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products },
        "New arrival products retrived successfully."
      )
    );
});

const getSimilarProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Product id is not valid.");
  }

  const product = await Product.findById(id).select("name category brand tags");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const similarProducts = await Product.find({
    _id: { $ne: id },
    isPublished: true,
    category: product?.category,
  }).limit(4);

  if (!similarProducts || similarProducts.length <= 0) {
    throw new ApiError(404, "No similar products found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { similarProducts },
        "Similar products fetched successfully."
      )
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Please provide valid product ID.");
  }

  const product = await Product.findById(id);

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

  if (updateFields.colours && Array.isArray(updateFields.colours)) {
    updateFields.colours = [...new Set(updateFields.colours)];
  }

  if (updateFields.sizes && Array.isArray(updateFields.sizes)) {
    updateFields.sizes = [...new Set(updateFields.sizes)];
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

  await Review.deleteMany({ product: id });

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
  getNewArrivals,
  getSimilarProducts,
  getProductById,
  updateProductDetails,
  deleteProduct,
  updateProductImages,
};
