import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "tutedude",
  });
};

export default connectDB;
