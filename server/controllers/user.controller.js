import mongoose from "mongoose";
import fs from "fs";
import Connection from "../schemas/connection.schema.js";
import User from "../schemas/user.schema.js";
import uploadToCloudinary from "../utils/cloudinary.js";

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const users = await User.find({ _id: { $ne: _id } }).select(
      "-password -refreshToken -__v"
    );
    if (!users) {
      throw { status: 404, message: "No users found" };
    }

    if (!users.length) {
      return res.status(200).json({ users: [] });
    }

    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw { status: 400, message: "Invalid User ID" };
    }

    const user = await User.findById(userId).select(
      "-password -refreshToken -__v"
    );

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const {
      firstName,
      lastName,
      userName,
      age,
      gender,
      location,
      bio,
      intrests,
    } = req.body;

    if (!_id) {
      throw { status: 401, message: "Unauthorized" };
    }

    const user = await User.findOne({ userName });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (user._id.toString() !== _id.toString()) {
      throw { status: 401, message: "Unauthorized" };
    }

    await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        userName,
        age,
        gender,
        location,
        bio,
        intrests,
      },
      { new: true }
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -__v"
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser: loggedInUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      throw { status: 401, message: "Unauthorized" };
    }

    const user = await User.findById(_id);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (user._id.toString() !== _id.toString()) {
      throw { status: 401, message: "Unauthorized" };
    }

    await User.findByIdAndDelete(_id);

    await Connection.deleteMany({
      $or: [{ userId: _id }, { connectionId: _id }],
    });

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkUserNameExists = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName });

    if (user) {
      throw { status: 404, message: "UserName not available" };
    }

    return res
      .status(200)
      .json({ success: true, message: "UserName available" });
  } catch (error) {
    next(error);
  }
};

export const checkUserExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return res
      .status(200)
      .json({ success: true, message: "User already exists" });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { _id } = req.user;
    if (!_id) {
      throw { status: 401, message: "Unauthorized" };
    }
    if (!currentPassword || !newPassword) {
      throw { status: 400, message: "All fields are required" };
    }

    if (currentPassword === newPassword) {
      throw {
        status: 400,
        message: "New password cannot be same as old password",
      };
    }

    const user = await User.findById(_id);

    const isPasswordValid = await user.validatePassword(currentPassword);

    if (!isPasswordValid) {
      throw { status: 404, message: "Invalid Credentials" };
    }

    user.password = newPassword;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllConnectionRequests = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser || !mongoose.Types.ObjectId.isValid(loggedInUser._id)) {
      throw { status: 401, message: "Unauthorized" };
    }

    const connectionRequests = await Connection.find({
      receiver: loggedInUser._id,
      status: "interested",
    }).populate("sender", [
      "_id",
      "firstName",
      "lastName",
      "age",
      "gender",
      "bio",
      "profilePic",
      "intrests",
    ]);

    if (!connectionRequests || connectionRequests.length === 0) {
      throw { status: 404, message: "No connection requests found" };
    }

    return res.status(200).json({ success: true, connectionRequests });
  } catch (error) {
    next(error);
  }
};

export const getAllConnections = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser || !mongoose.Types.ObjectId.isValid(loggedInUser._id)) {
      throw { status: 401, message: "Unauthorized" };
    }

    const connections = await Connection.find({
      $or: [
        { sender: loggedInUser._id, status: "accepted" },
        { receiver: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("sender", [
        "_id",
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "profilePic",
        "intrests",
      ])
      .populate("receiver", [
        "_id",
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "profilePic",
        "intrests",
      ]);

    if (!connections || connections.length === 0) {
      throw { status: 404, message: "No connections found" };
    }

    const data = connections
      .filter((connection) => connection.sender && connection.receiver)
      .map((connection) => {
        if (connection.sender._id.toString() === loggedInUser._id.toString()) {
          return connection.receiver;
        } else {
          return connection.sender;
        }
      });

    return res.status(200).json({ success: true, connections: data });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const maxLimit = limit > 50 ? 50 : limit;

    const loggedInUser = req.user;
    if (!loggedInUser) {
      throw { status: 401, message: "Unauthorized" };
    }

    const connectionRequests = await Connection.find({
      $or: [{ receiver: loggedInUser._id }, { sender: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((connection) => {
      hideUsersFromFeed.add(connection.sender._id.toString());
      hideUsersFromFeed.add(connection.receiver._id.toString());
    });

    const queryConditions = {
      $and: [
        { _id: { $nin: [...hideUsersFromFeed] } },
        { _id: { $ne: loggedInUser._id } },
      ],
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ],
    };

    const totalCount = await User.countDocuments(queryConditions);

    const feed = await User.find(queryConditions)
      .select("-password -refreshToken -__v")
      .skip(skip)
      .limit(maxLimit);

    if (!feed || feed.length === 0) {
      throw { status: 404, message: "No feed found" };
    }

    return res.status(200).json({
      success: true,
      data: feed,
      pagination: { page, limit, total: totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePic = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const pic = req.params.pic;

    const allowedPics = ["profilePic", "coverPic"];

    if (!allowedPics.includes(pic)) {
      throw { status: 400, message: "Invalid picture type" };
    }

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      throw { status: 401, message: "Unauthorized" };
    }

    const profilePic = await uploadToCloudinary(req.file.path);

    if (!profilePic) {
      throw { status: 400, message: "Failed to upload profile picture" };
    }

    fs.unlinkSync(req.file.path);

    await User.findByIdAndUpdate(
      _id,
      {
        [pic]: profilePic.secure_url,
      },
      { new: true }
    );

    const loggedInUser = await User.findById(_id).select(
      "-password -refreshToken -__v"
    );

    if (!loggedInUser) {
      throw { status: 404, message: "User not found" };
    }

    return res.status(200).json({ success: true, user: loggedInUser });
  } catch (error) {
    next(error);
  }
};

export const changeUserName = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { userName } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      throw { status: 401, message: "Unauthorized" };
    }

    if (!userName) {
      throw { status: 400, message: "UserName is required" };
    }

    const user = await User.findByIdAndUpdate(
      _id,
      {
        userName,
      },
      { new: true }
    );

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const loggedInUser = await User.findById(_id).select(
      "-password -refreshToken -__v"
    );

    if (!loggedInUser) {
      throw { status: 404, message: "User not found" };
    }

    return res.status(200).json({ success: true, user: loggedInUser });
  } catch (error) {
    next(error);
  }
};
