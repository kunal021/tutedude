import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/DBConnect.js";
import rootRoute from "./routes/root.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1", rootRoute);
app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to Database");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
