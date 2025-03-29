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

export { addBrand, deleteBrand };
