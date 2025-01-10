import express from "express";
import multer from "multer";
import authValidation from "../middlewares/authValidation.middleware.js";
import {
  changePassword,
  changeUserName,
  checkUserExists,
  checkUserNameExists,
  deleteUser,
  getAllConnectionRequests,
  getAllConnections,
  getAllUsers,
  getFeed,
  getUser,
  getUserById,
  updateProfilePic,
  updateUser,
} from "../controllers/user.controller.js";
import { updateUserSchema } from "../utils/validation.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/profile", authValidation, getUser);
router.get("/get/:userId", getUserById);
router.get("/getall", authValidation, getAllUsers);
router.patch(
  "/update",
  authValidation,
  validateSchema(updateUserSchema),
  updateUser
);
router.delete("/delete", authValidation, deleteUser);
router.post("/username-exists", authValidation, checkUserNameExists);
router.patch("/username-change", authValidation, changeUserName);
router.post("/user-exists", authValidation, checkUserExists);
router.patch("/change-password", authValidation, changePassword);
router.get(
  "/all-connection-requests",
  authValidation,
  getAllConnectionRequests
);
router.get("/all-connections", authValidation, getAllConnections);
router.get("/feed", authValidation, getFeed);
router.post(
  "/upload-profile-pic/:pic",
  authValidation,
  upload.single("profilePic"),
  updateProfilePic
);

export default router;
