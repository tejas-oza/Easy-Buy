import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Brand } from "../models/brand.models.js";
import mongoose from "mongoose";
import fs from "fs";

const addBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const logo = req.file;

  if (!name) {
    throw new ApiError(400, "Brand name required.");
  }

  const isBrandExists = await Brand.exists({ name });

  if (isBrandExists) {
    throw new ApiError(400, `Brand '${name}' already exists.`);
  }

  const brand = await Brand.create({
    name,
    logo: logo?.path || null,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { brand },
        `Brand '${brand?.name}' created successfully.`
      )
    );
});

const getAllBrands = asyncHandler(async (req, res) => {
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
  const allBrands = await Brand.find(filter);

  if (!allBrands || allBrands.length <= 0) {
    throw new ApiError(404, "Brands not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Brands: allBrands },
        "Fetched all brands successfully."
      )
    );
});

const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Brand id is not valid.");
  }

  const brand = await Brand.findById(id).select("name");

  if (!brand) {
    throw new ApiError(404, "Brnad not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Brand fetched successfully."));
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Brand id is not valid.");
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedBrand) {
    throw new ApiError(404, "Brand not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedBrand }, "Brnad updated successfully.")
    );
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid brand Id.");
  }

  const deletedBrand = await Brand.findByIdAndDelete(id);

  if (deleteBrand?.logo !== null || deleteBrand?.logo !== undefined) {
    const brandLogo = deletedBrand?.logo;

    if (fs.existsSync(brandLogo)) {
      fs.unlinkSync(brandLogo);
    }
  }

  if (!deletedBrand) {
    throw new ApiError(404, `Brand not found or already deleted.`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Brand '${deletedBrand?.name}' deleted successfully.`
      )
    );
});

export { addBrand, getAllBrands, getBrandById, updateBrand, deleteBrand };
