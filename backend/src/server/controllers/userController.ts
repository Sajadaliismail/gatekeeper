import { Request, Response } from "express";
import { UserInteractor } from "../interactors/userInteractor";
import { IUser } from "../models/userSchema";
import { passwordCompare } from "../services/hashPassword";
import { createToken } from "../services/jwt";

// Controller class responsible for handling user-related operations
export class UserController {
  private userInteractor: UserInteractor;

  // Constructor initializes the UserInteractor instance for database operations
  constructor() {
    this.userInteractor = new UserInteractor();
  }

  /**
   * Handles the creation of a new user.
   * Checks if a user with the provided email already exists.
   * If not, creates a new user and returns the user data.
   * @param req - Express request object
   * @param res - Express response object
   */
  async createUser(req: Request, res: Response) {
    try {
      const userData: IUser = req.body; // Extract user data from the request body

      // Check if a user with the given email already exists
      const existing = await this.userInteractor.findByEmail(userData.email);
      if (!existing) {
        await this.userInteractor.createUser(userData); // Create new user
        res.status(200).json({ success: true }); // Respond with newly created user data
      } else {
        res.status(404).json({ error: "User already exists" }); // Conflict: user exists
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message); // Log error message for debugging
      }
      res.status(404).json({ error: "Error creating user" }); // Respond with a generic error message
    }
  }

  /**
   * Handles user login.
   * Validates the user's email and password.
   * If valid, generates a JWT token and sends it in a cookie.
   * @param req - Express request object
   * @param res - Express response object
   */
  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body; // Extract email and password from the request body

      // Fetch user details by email
      const user = await this.userInteractor.findByEmail(email);
      if (!user) {
        res.status(404).json({ error: "User is not registered" }); // Forbidden: user not found
      } else if (user.isBanned) {
        res.status(404).json({ error: "User is banned" }); // Forbidden: user is banned
      } else {
        // Verify the provided password against the stored hash
        const passwordMatch = await passwordCompare(password, user.password);
        if (!passwordMatch) {
          res.status(404).json({ error: "Incorrect password" }); // Unauthorized: password mismatch
        } else {
          // Generate a JWT token for authenticated user
          const token = await createToken({
            email: user.email,
            role: user.role,
          });

          // Filter sensitive data before sending it to the client
          const filteredData = {
            role: user.role,
            token,
            email: user.email,
          };

          // Set a secure HTTP-only cookie containing the token
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true, // Ensure secure transmission over HTTPS
            maxAge: 7 * 24 * 60 * 1000, // Set cookie expiration time
          });

          res.status(200).json(filteredData); // Respond with user data and token
        }
      }
    } catch (error) {
      console.error("Error during login process:", error); // Log any unexpected error
      res.status(500).json({ error: "Internal server error" }); // Respond with generic server error
    }
  }

  /**
   * Retrieves user information based on the role.
   * Typically used for authenticated requests.
   * @param req - Express request object
   * @param res - Express response object
   */
  async getUser(req: Request, res: Response) {
    try {
      const email = req.email; // Extract email from the request
      const role = req.role; // Extract role from the request
      if (role === "user" && email) {
        // If the user asks the request only that users detail is given
        const user = await this.userInteractor.getUserDetails(email); // Fetch user by email

        res.status(200).json(user[0]); // Respond with user data}
      } else {
        //for the admins and the moderators all users data is given
        const userData = await this.userInteractor.findAllUsers();

        res.status(200).json({ users: userData }); // Respond with all users data}
      }
    } catch (error) {
      console.error("Error fetching user data:", error); // Log error for debugging
      res.status(404).json({ error: "Error finding user" }); // Respond with generic not found error
    }
  }

  /**
   * Updates the user role
   * Used for switching the roles of user,api is open only for admins
   * @param req
   * @param res
   */
  async changeRole(req: Request, res: Response) {
    try {
      const { email, role } = req.body; //Extract email and new role from the body
      // Updates the role for the given email using the update method
      const updatedRole = await this.userInteractor.findByEmailAndUpdate(
        email,
        { role: role }
      );
      res.status(200).json({ role: updatedRole });
    } catch (error) {
      console.error("Error updating user data:", error); // Log error for debugging
      if (error instanceof Error)
        res.status(404).json({ error: error.message });
      else res.status(500).json({ error: "Internal server error" }); // Respond with generic server error
    }
  }

  /**
   * Updates the current ban status of the user
   * Used for switching the ban status of the user
   * @param req
   * @param res
   */
  async changeStatus(req: Request, res: Response) {
    try {
      const { email, isBanned } = req.body; // Extract email and current status from the req.body

      const updatedStatus = await this.userInteractor.findByEmailAndUpdate(
        email,
        { isBanned: isBanned }
      );
      res.status(200).json({ success: updatedStatus });
    } catch (error) {
      console.error("Error updating user data:", error); // Log error for debugging
      if (error instanceof Error)
        res.status(404).json({ error: error.message });
      else res.status(500).json({ error: "Internal server error" }); // Respond with generic server error
    }
  }

  /**
   * removes the user from database
   * Used for removing user from the app itself
   * @param req
   * @param res
   */
  async removeUser(req: Request, res: Response) {
    try {
      const { email } = req.body; // Extract email from the req.body

      const removeStatus = await this.userInteractor.removeUserByEmail(email);
      res.status(200).json({ success: removeStatus });
    } catch (error) {
      console.error("Error updating user data:", error); // Log error for debugging
      if (error instanceof Error)
        res.status(404).json({ error: error.message });
      else res.status(500).json({ error: "Internal server error" }); // Respond with generic server error
    }
  }

  /**
   * Updates the current details of the user
   * Used for updating details of the user
   * @param req
   * @param res
   */
  async editUser(req: Request, res: Response) {
    try {
      const { name, address, email } = req.body;
      console.log(req.body);

      const updatedData = await this.userInteractor.findByEmailAndUpdate(
        email,
        { name: name, address: address }
      );
      res.status(200).json({ success: updatedData });
    } catch (error) {
      console.error("Error updating user data:", error); // Log error for debugging
      if (error instanceof Error)
        res.status(404).json({ error: error.message });
      else res.status(500).json({ error: "Internal server error" }); // Respond with generic server error
    }
  }
}
