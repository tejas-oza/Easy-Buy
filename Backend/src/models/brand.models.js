import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true, // Prevent duplicate brand names
      index: true,
      trim: true,
    },
    logo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.index({ name: "text" });

export const Brand = mongoose.model("Brand", brandSchema);
