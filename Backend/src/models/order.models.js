import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    images: [
      {
        type: String,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    razorpayDetail: {
      paymentId: {
        type: String,
      },
      orderId: {
        type: String,
      },
      signature: {
        type: String,
      },
    },

    couponDetails: {
      code: {
        type: String,
      },
      discountType: {
        type: String,
      },
      discountValue: {
        type: String,
      },
      appliedValue: {
        type: String,
      },
    },

    actualAmount: {
      type: Number,
      required: true,
    },

    shippingCharges: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
    delivaryDate: {
      type: Date,
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },

    cancelledDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
