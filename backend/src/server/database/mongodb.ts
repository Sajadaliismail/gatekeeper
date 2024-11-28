import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.MONGODB_URI || ""; // MongoDB connection string stored in environment variable

/**
 * Establishes a connection to the MongoDB Atlas database using Mongoose.
 * Uses the URI defined in the environment variables for security.
 */
const connectDb = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(URI).then(() => {
      console.log("Database connected successfully"); // Log success message on successful connection
    });
  } catch (error) {
    // Log error details if the connection fails
    if (error instanceof Error)
      console.log("Error connecting to database", error.message);
  }
};

export default connectDb; // Export the function for use in other modules
