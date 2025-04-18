import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import fs from "fs";
// import path from "path";

const registerNewUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, phoneNo, password } = req.body;

  const avatarFile = req.file;

  if (!username || !email || !phoneNo || !password) {
    throw new ApiError(
      400,
      "All fields(username, email, phone number, password) are required."
    );
  }

  const existedUser = await User.exists({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this username or email or phone number already exist."
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName: fullName.toLowerCase() ? fullName : null,
    email,
    phoneNo,
    password,
    avatar: avatarFile?.path || null,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user. Please try again later.");
  }

  res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, phoneNo, password } = req.body;

  if (!username && !email && !phoneNo) {
    throw new ApiError(400, "Username, email, or phone number is required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (!user) {
    throw new ApiError(
      404,
      "User with this username, email or phone number not found."
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(401, "Invalid credentials. Failed to log in.");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully."));
});

const getLoggedInUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "User details retrieved successfully.")
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookie.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating new access token."
    );
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  let { search = "", page = 1, limit = 1 } = req.query;

  page = Math.max(parseInt(page, 10) || 1, 1);
  limit = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  let filter = {
    _id: { $ne: req.user._id },
  };

  if (search) {
    filter = {
      $text: {
        $search: search,
      },
    };
  }

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("-password -refreshToken");

  if (!users.length) {
    throw new ApiError(404, "No users found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users retrieved successfully."));
});

const filterUsers = asyncHandler(async (req, res) => {
  let { search = "", page = 1, limit = 10 } = req.query;

  // Convert page and limit to numbers and ensure they are positive
  page = Math.max(parseInt(page, 10) || 1, 1);
  limit = Math.max(parseInt(limit, 10) || 10, 1);

  const skip = (page - 1) * limit;
  const query = {};

  if (search.trim()) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, totalUsers] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  if (!users || users.length === 0) {
    throw new ApiError(404, "No user found.");
  }

  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "get all users."
    )
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format.");
  }

  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User retrieved successfully."));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized request.");
  }

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required.");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password.");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully."));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNo } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized request.");
  }

  if (!fullName && !email && !phoneNo) {
    throw new ApiError(400, "Fullname, email or phone number required.");
  }

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
        phoneNo: phoneNo,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  // if (fullName) user.fullName = fullName;

  // if (email) user.email = email;

  // if (phoneNo) user.phoneNo = phoneNo;

  // await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser },
        "Account details updated successfully."
      )
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
  const newAvatarFile = req.file;
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized request.");
  }

  if (!newAvatarFile) {
    throw new ApiError(400, "Avatar file is required.");
  }

  if (user.avatar) {
    // const oldAvatarPath = path.join(user.avatar);
    const oldAvatarPath = user.avatar;

    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath); // Remove file synchronously
    }
  }

  user.avatar = newAvatarFile?.path;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: user.avatar },
        "Avatar updated successfully."
      )
    );
});

const addAddress = asyncHandler(async (req, res) => {
  const { street, city, state, country, zipCode } = req.body;

  if (!street || !city || !state || !country || !zipCode) {
    throw new ApiError(400, "Please fill all the fields of address.");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized request.");
  }

  user.address.push({ street, city, state, country, zipCode });
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { address: user.address },
        "Address added successfully."
      )
    );
});

const deleteAdress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  // const user = await User.findByIdAndUpdate(
  //   req.user?._id,
  //   { $pull: { address: { _id: id } } }, // Efficiently removes the address
  //   { new: true, select: "address" }
  // );

  if (!user) {
    throw new ApiError(401, "Unauthorizd request.");
  }

  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === id
  );

  if (addressIndex === -1) {
    throw new ApiError(404, "Address not found.");
  }

  user.address.splice(addressIndex, 1);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Address removed successfully."));
});

const deleteMyAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Unauthorized request.");
  }

  if (user.avatar) {
    // const userAvatar = path.join(user.avatar);

    if (fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar); // Remove file synchronously
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Your account deleted syccessfully."));
});

const deleteCustomerAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedAccount = await User.findByIdAndDelete(id).select(
    "-password -refreshToken"
  );

  if (!deletedAccount) {
    throw new ApiError(404, "Customer not found.");
  }

  if (deletedAccount.avatar) {
    // const userAvatar = path.join(deletedAccount.avatar);
    // console.log(userAvatar);
    if (fs.existsSync(deletedAccount.avatar)) {
      fs.unlinkSync(deletedAccount.avatar); // Remove file synchronously
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedAccount }, "Account deleted successfully.")
    );
});

export {
  registerNewUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getLoggedInUser,
  getAllUsers,
  getUserById,
  changePassword,
  updateAccountDetails,
  updateAvatar,
  addAddress,
  deleteAdress,
  deleteCustomerAccount,
  deleteMyAccount,
  filterUsers,
};
