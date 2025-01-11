import express from "express";
import {
  login,
  signup,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { signupSchema, loginSchema } from "../utils/validation.js";
import authValidation from "../middlewares/authValidation.middleware.js";
import { checkUserNameExists } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", validateSchema(loginSchema), login);
router.post("/signup", validateSchema(signupSchema), signup);
router.post("/logout", authValidation, logout);
router.post("/username-exists", checkUserNameExists);
router.post("/refresh-token", refreshAccessToken);

export default router;
