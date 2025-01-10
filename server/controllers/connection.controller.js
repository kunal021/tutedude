import Connection from "../schemas/connection.schema.js";
import User from "../schemas/user.schema.js";

export const sendConnectionRequest = async (req, res, next) => {
  try {
    const { _id: senderId } = req.user;
    const receiverId = req.params.userId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      throw { status: 400, message: "Invalid status" };
    }

    if (senderId === receiverId) {
      throw { status: 400, message: "You cannot connect with yourself" };
    }

    const senderUser = await User.findById(senderId);

    if (!senderUser) {
      throw { status: 404, message: "User not found" };
    }

    const receiverUser = await User.findById(receiverId);

    if (!receiverUser) {
      throw { status: 404, message: "User not found" };
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingConnection) {
      throw { status: 400, message: "Connection already exists" };
    }

    const data = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: status,
    });

    return res.status(200).json({
      success: true,
      message:
        status === "interested"
          ? `${req.user.userName} is interested in ${receiverUser.userName}`
          : `${req.user.userName} has ignored ${receiverUser.userName}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewConnectionRequest = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionId = req.params.connectionId;
    const status = req.params.status;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      throw { status: 400, message: "Invalid status" };
    }

    if (!loggedInUser) {
      throw { status: 401, message: "Unauthorized" };
    }

    const connection = await Connection.findOne({
      _id: connectionId,
      receiver: loggedInUser._id,
      status: "interested",
    });

    if (!connection) {
      throw { status: 404, message: "Connection not found" };
    }

    connection.status = status;
    const data = await connection.save();

    return res.status(200).json({
      success: true,
      message:
        status == "accepted"
          ? "Connection request accepted"
          : "Connection request rejected",
      data,
    });
  } catch (error) {
    next(error);
  }
};
