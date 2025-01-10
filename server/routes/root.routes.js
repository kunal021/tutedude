import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import connectionRouter from "./connection.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/connection", connectionRouter);

export default router;
