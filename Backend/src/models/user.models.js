import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  zipCode: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    fullName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    phoneNo: {
      type: String,
      required: true,
    },

    address: [addressSchema],

    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    avatar: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
