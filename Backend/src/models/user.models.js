import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      lowercase: true,
      minlength: 3,
      trim: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    phoneNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    address: {
      type: [addressSchema],
      default: [],
    },

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
