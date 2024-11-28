import { MongooseError } from "mongoose";
import User, { IUser } from "../models/userSchema";

/**
 * Repository class for interacting with the User collection in the database.
 * Encapsulates CRUD operations and ensures separation of concerns.
 */
export class UserRepository {
  /**
   * Finds a user by their unique ID.
   *
   * @param id - The unique identifier of the user.
   * @returns The user document if found, or null if no user matches the ID.
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id); // Uses Mongoose's `findById` method
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address to search for.
   * @returns The user document if found, or null if no user matches the email.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }); // Finds a single user document by email
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address to search for.
   * @returns The status of deletion of the document, Boolean.
   */
  async removeByEmail(email: string): Promise<boolean> {
    try {
      await User.deleteOne({ email }); // Finds and deletes a single user document by email
      return true;
    } catch (error) {
      throw new Error("Error deleting the document");
    }
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address to search for.
   * @returns The user document if found, or null if no user matches the email.
   */
  async getUserDetails(email: string) {
    return await User.aggregate([
      { $match: { email: email } },
      { $project: { password: 0, _id: 0 } },
    ]); // Finds a single user document by email
  }

  /**
   * Finds all users in the database.
   *
   * @returns The array of all users.
   */
  async findAllUsers(): Promise<IUser[]> {
    return await User.aggregate([
      { $match: {} },
      { $project: { _id: 0, password: 0 } },
    ]); // Finds all user documents
  }

  /**
   * Creates a new user in the database.
   *
   * @param data - The user data to create a new document.
   * @returns The newly created user document.
   */

  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = new User(data); // Creates a new user instance
      await user.save(); // Saves the user to the database
      return user; // Returns the saved user document
    } catch (error) {
      if (error instanceof MongooseError) {
        if (error.name === "ValidationError") {
          // Validation errors from Mongoose
          throw new Error("Validation failed. Please check your data.");
        } else if (
          error.name === "MongoServerError" ||
          error.name === "MongoError"
        ) {
          // Check for duplicate key error
          if (error.message.includes("duplicate key")) {
            const field = error.message.match(/index: (.+?)_/)?.[1] || "field";
            throw new Error(`A user with this ${field} already exists.`);
          }
        }
      }
      // General error fallback
      throw new Error("An unexpected error occurred while creating the user.");
    }
  }

  /**
   * update data of a user in the database.
   *
   * @param data - The user data to be updated.
   * @param email - The email to identify the user
   * @returns The updated document.
   */
  async updateUser(email: string, data: Partial<IUser>) {
    try {
      const user = await User.findOneAndUpdate(
        { email: email }, // Filter condition to find the user
        data, // Dynamically set the provided fields
        { new: true, runValidators: true } // Running the validators so that addditional validations are done
      );
      if (!user) throw new Error("User not found");

      return true;
    } catch (error) {
      throw new Error("Error updating user");
    }
  }
}
