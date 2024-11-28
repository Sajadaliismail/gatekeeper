import { NextFunction, Request, Response } from "express";

/**
 * Middleware to authorize users based on their roles.
 * Ensures that the user's role matches one of the required roles for a specific route.
 *
 * @param requiredRoles - An array of allowed roles (`"admin"`, `"moderator"`, `"user"`) for the route.
 * @returns A middleware function that checks the user's role.
 */
export function checkRole(requiredRoles: ("admin" | "moderator" | "user")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate that the `req.role` exists and matches one of the required roles
    if (!req.role || !requiredRoles.includes(req.role)) {
      res.status(403).json({ message: "Access denied. Insufficient role." });
    }

    // If the user's role is valid, proceed to the next middleware or route handler
    else next();
  };
}
