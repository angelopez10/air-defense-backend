import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log(">>> DB is connected");
  } catch (error) {
    console.log(error);
  }
};
