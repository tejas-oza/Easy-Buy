import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.models.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    throw new ApiError(401, "Category name is required and must be a string.");
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(409, `Category '${name}' already exists.`);
  }

  const category = await Category.create({ name });
  if (!category) {
    throw new ApiError(400, "Something went wrong while creating category.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        category,
        `Category '${category.name}' created successfully.`
      )
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
  const { search } = req.query;

  let filter = {};

  if (search) {
    filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { $text: { $search: search } },
      ],
    };
  }

  const allCategories = await Category.find(filter);

  if (!allCategories || allCategories.length <= 0) {
    throw new ApiError(404, "No Category found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Categories: allCategories },
        "All categories fetched successfully."
      )
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID.");
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { category }, "Category retrived successfully.")
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID.");
  }

  const category = await Category.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
      },
    },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, `Category updated successfully.`));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID.");
  }

  // TODO:- check whether any product using this category and if yes then give user a message to change the categories of those products.

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, `Category not found or already deleted.`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Category ${category?.name} deleted successfully.`
      )
    );
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
