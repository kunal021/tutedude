import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 56,
    },
    lastName: {
      type: String,
      minlength: 1,
      maxlength: 56,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 56,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 56,
      sparse: true,
    },
    refreshToken: {
      type: String,
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 250,
      default: "Tell us about yourself",
    },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    intrests: {
      type: [String],
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });
};

userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
