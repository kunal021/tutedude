import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import {
  getFriendRecommendations,
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
router.get("/recommendations", authValidation, getFriendRecommendations);

export default router;
