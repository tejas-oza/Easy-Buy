import { Router } from "express";
import {
  addAddress,
  changePassword,
  deleteAdress,
  deleteCustomerAccount,
  deleteMyAccount,
  filterUsers,
  getAllUsers,
  getLoggedInUser,
  getUserById,
  loginUser,
  logoutUser,
  registerNewUser,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// public routes
router.route("/register").post(upload.single("avatar"), registerNewUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getLoggedInUser);
router.route("/password").put(verifyJWT, changePassword);
router.route("/update-account").put(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .put(verifyJWT, upload.single("avatar"), updateAvatar);

router.route("/address").put(verifyJWT, addAddress);
router.route("/address/:id").delete(verifyJWT, deleteAdress);

router.route("/delete-my-account").delete(verifyJWT, deleteMyAccount);

// admin only routes
router.route("/all-users").get(verifyJWT, authorizeRoles("admin"), getAllUsers);
router.route("/filter").get(verifyJWT, authorizeRoles("admin"), filterUsers);
router.route("/:id").get(verifyJWT, authorizeRoles("admin"), getUserById);
router
  .route("/delete-customer-account/:id")
  .delete(verifyJWT, authorizeRoles("admin"), deleteCustomerAccount);

export default router;
