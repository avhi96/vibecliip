import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed", error.message);
        console.log("Mongo URI:", process.env.MONGO_URI);v
    }
}

export default connectDB;