import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/authorization";

const userController = new UserController(); // Initialize the UserController
const route = Router(); // Create a new Router instance

// Extend the Express Request interface to include custom properties (email and role)
declare global {
  namespace Express {
    interface Request {
      email?: string; // Email of the authenticated user (optional)
      role: "admin" | "moderator" | "user"; // Role of the authenticated user
    }
  }
}

/**
 * Route to handle user signup.
 * Calls the `createUser` method from UserController.
 */
route.post("/signup", userController.createUser.bind(userController));

/**
 * Route to handle user login.
 * Calls the `loginUser` method from UserController.
 */
route.post("/login", userController.loginUser.bind(userController));

/**
 * Route to get user information.
 * Middleware:
 * - `authMiddlware`: Verifies the user's token.
 * - `checkRole`: Checks if the user's role is authorized to access this endpoint.
 * Calls the `getUser` method from UserController.
 */
route.get(
  "/",
  authMiddleware, // Middleware to authenticate the user
  checkRole(["admin", "moderator", "user"]), // Middleware to check roles
  userController.getUser.bind(userController) // Calls the getUser method
);

/**
 * Route to change the role of a particular user.
 * Requires authentication and specific roles (admin).
 * Middleware:
 * - `authMiddlware`: Verifies the user's token.
 * - `checkRole`: Checks if the user's role is authorized to access this endpoint.
 * Calls the `changeRole` method from UserController.
 */
route.patch(
  "/change-role",
  authMiddleware,
  checkRole(["admin"]),
  userController.changeRole.bind(userController)
);

/**
 * Route to change the status of a particular user.
 * Requires authentication and specific roles (admin or moderator).
 * Middleware:
 * - `authMiddlware`: Verifies the user's token.
 * - `checkRole`: Checks if the user's role is authorized to access this endpoint.
 * Calls the `changeStatus` method from UserController.
 */
route.patch(
  "/change-status",
  authMiddleware,
  checkRole(["admin", "moderator"]),
  userController.changeStatus.bind(userController)
);

/**
 * Route to delete a user.
 * Requires authentication and specific roles (admin).
 * Middleware:
 * - `authMiddlware`: Verifies the user's token.
 * - `checkRole`: Checks if the user's role is authorized to access this endpoint.
 * Calls the `deleteUser` method from UserController.
 */
route.delete(
  "/delete-user",
  authMiddleware,
  checkRole(["admin", "user"]),
  userController.removeUser.bind(userController)
);

/**
 * Route to delete a user.
 * Requires authentication and specific roles (admin).
 * Middleware:
 * - `authMiddlware`: Verifies the user's token.
 * - `checkRole`: Checks if the user's role is authorized to access this endpoint.
 * Calls the `deleteUser` method from UserController.
 */
route.patch(
  "/edit-user",
  authMiddleware,
  checkRole(["user"]),
  userController.editUser.bind(userController)
);

export default route; // Export the route to be used in the main application
