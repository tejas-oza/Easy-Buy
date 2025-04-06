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
      index: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: [
        1000,
        "Product description should not exceed 1000 characters.",
      ],
    },

    // category: {
    //   categoryId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Category",
    //     required: true,
    //     index: true,
    //   },
    //   name: {
    //     type: String,
    //     required: true,
    //     index: true,
    //   },
    // },

    category: {
      type: String,
      required: true,
      index: true,
    },

    // brand: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Brand",
    //   required: true,
    //   index: true,
    // },

    brand: {
      type: String,
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
      min: 0,
      max: 100,
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

    colours: [
      {
        type: String,
      },
    ],

    sizes: [
      {
        type: String,
      },
    ],

    weight: {
      type: Number,
      min: 0,
    },

    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },

    shippingCost: {
      type: Number,
      min: 0,
      default: 0,
    },

    returnPolicy: {
      type: String,
      required: [true, "Return policy required."],
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    warranty: { type: String },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    isPublished: {
      type: Boolean,
      required: true,
      default: true,
    },
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

productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  category: "text",
  brand: "text",
});

export const Product = mongoose.model("Product", productSchema);
