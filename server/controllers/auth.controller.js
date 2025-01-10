import User from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.createAccessToken();

  const refreshToken = user.createRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true, // Ensures cookies are not accessible via JavaScript
  secure: process.env.NODE_ENV === "production" ? true : false, // Set `true` in production to use HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-site cookies in production
};

export const login = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { userName: loginIdentifier }],
    });

    if (!user) {
      throw { status: 404, message: "Invalid Credentials" };
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw { status: 404, message: "Invalid Credentials" };
    }

    const loogedInUser = await User.findById(user._id).select(
      "-password -refreshToken -__v"
    );

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        success: true,
        message: "User authenticated successfully",
        user: loogedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      age,
      gender,
      location,
      bio,
      intrests,
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      throw { status: 400, message: "User already exists" };
    }

    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password,
      age,
      gender,
      location,
      bio,
      intrests,
    });

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );

    return res
      .status(200)
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("accessToken", cookieOptions)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw { status: 401, message: "Unauthorized" };
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    next(error);
  }
};
