import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Index for faster lookup
    },
    description: {
      type: String,
      required: true,
      maxlength: [
        1000,
        "Product description should not exceed 1000 characters.",
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true, // Index for performance
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // Ensures percentage range
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    shippingCost: { type: Number, min: 0 },
    returnPolicy: { type: String },
    variants: [{ color: String, size: String, price: Number }],
    tags: [{ type: String, index: true }], // Index for better searching
    warranty: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to calculate final price dynamically
productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

export const PRoduct = mongoose.model("Product", productSchema);
