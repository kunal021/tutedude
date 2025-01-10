import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import {
  reviewConnectionRequest,
  sendConnectionRequest,
} from "../controllers/connection.controller.js";

const router = express.Router();

router.post("/send/:status/:userId", authValidation, sendConnectionRequest);
router.post(
  "/review/:status/:connectionId",
  authValidation,
  reviewConnectionRequest
);

export default router;
