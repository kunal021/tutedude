import User from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";

const authValidation = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "");

    // console.log(token);

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { _id } = decodedToken;

    const user = await User.findById(_id).select("-password -refreshToken");

    if (!user) {
      throw new Error("Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authValidation;
