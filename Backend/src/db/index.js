import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoDBConnectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    console.log(
      `\n MongoDB connected !! DB Host -> ${mongoDBConnectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDB connection error`, error);
    process.exit(1);
  }
};

export default connectDB;
