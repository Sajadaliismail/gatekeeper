import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/jwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { UserInteractor } from "../interactors/userInteractor";
/**
 * Middleware to authenticate and authorize requests using a JWT token.
 * Validates the token and extracts user information (email, role) for further use.
 * Adds email and role to the `req` object if token is valid.
 *
 * @param req - Express request object, expected to contain a JWT token in cookies.
 * @param res - Express response object for sending error responses when authentication fails.
 * @param next - Express next function to pass control to the next middleware or route handler.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInteractor = new UserInteractor();
  try {
    const { token } = req.cookies; // Extract token from cookies

    if (!token) {
      // Respond with an error if the token is missing
      res.status(401).json({ message: "Authentication token is missing" });
    } else {
      // Verify the token and decode its payload
      const decoded = await verifyToken(token);

      const user = await userInteractor.findByEmail(decoded.email);
      if (!user) res.status(401).json({ message: "User not found" });
      else if (user?.isBanned)
        res.status(401).json({ message: "User has been banned" });
      else {
        // Attach user information (email and role) to the request object for downstream use

        req.email = decoded.email;

        req.role = decoded.role;

        next(); // Proceed to the next middleware or route handler
      }
    }
  } catch (error) {
    // Handle specific JWT errors for clarity
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token or signature" });
    } else if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
    } else {
      // Catch-all error response for unexpected failures
      console.error("Token verification error:", error); // Log the error for debugging
      res
        .status(500)
        .json({ message: "Something went wrong with token verification" });
    }
  }
};
