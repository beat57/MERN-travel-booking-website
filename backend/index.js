import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js"; 
 
dotenv.config();
const app = express();
const port = process.env.PORT || 2000;
 
// Database connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  } 
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());  
app.use("/auth", authRoute); 

// Start server 
const startServer = async () => {
  await connect();
  app.listen(port, () => {
    console.log("Server running on port", port);
  });
};

startServer();



