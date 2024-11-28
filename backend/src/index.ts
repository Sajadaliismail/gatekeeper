import express from "express";
import connectDb from "./server/database/mongodb";
import route from "./server/routes/route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import path from "path";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3100; // Fallback to port 3100 if PORT is not defined
const CORS_ORIGIN = process.env.FRONTEND || ""; // Fallback to port 3100 if PORT is not defined

// Middleware for parsing URL-encoded data and JSON
app.use(express.urlencoded({ extended: true })); // Support URL-encoded bodies
app.use(express.json()); // Support JSON-encoded bodies

// Use cors to allow api calls

const corsOption: CorsOptions = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOption));
// Middleware for parsing cookies
app.use(cookieParser());

// Connect to the MongoDB database
connectDb().catch((error) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit the application if the database connection fails
});

// Route all incoming requests through the main router
app.use("/api", route);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
