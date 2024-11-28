import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Type definition for the User document.
 * Extends the Mongoose Document interface to include the User-specific fields.
 */
export type IUser = Document & {
  name: string; // The name of the user
  email: string; // The email address of the user
  password: string; // The hashed password for authentication
  role: "admin" | "moderator" | "user"; // User role, determines access levels
  isBanned?: boolean; // Indicates if the user is active or deactivated (optional)
  address?: string;
};

/**
 * Mongoose schema for the User model.
 * Defines the structure, types, and constraints for the User collection.
 */
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate email addresses
      lowercase: true, // Converts email to lowercase for consistency
      trim: true, // Removes leading and trailing whitespace
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "moderator", "user"], // Restricts values to specific roles
      default: "user", // Default role is "user"
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false, // All users are active by default
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

/**
 * Mongoose model for the User schema.
 * Represents the User collection in the database.
 */
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
