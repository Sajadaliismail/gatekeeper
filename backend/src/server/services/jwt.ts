import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const secret = process.env.JWT_SECRET; // Ensure the JWT secret is loaded from environment variables

// Extend JwtPayload to include custom properties for your application
interface JwtPayloadProps extends JwtPayload {
  email: string;
  role: "admin" | "moderator" | "user";
}

/**
 * Creates a JSON Web Token (JWT) with the provided payload.
 *
 * @param data - The payload containing user information (email and role).
 * @returns A promise that resolves to a signed JWT.
 */
export async function createToken(data: JwtPayloadProps): Promise<string> {
  if (!secret) {
    throw new Error("JWT secret is not defined in the environment variables.");
  }

  const token = jwt.sign(data, secret, { expiresIn: "1d" }); // Token expires in 1 day
  console.log(token); // Log the token for debugging purposes (remove in production)
  return token;
}

/**
 * Verifies and decodes a JSON Web Token (JWT).
 *
 * @param token - The JWT to verify.
 * @returns A promise that resolves to the decoded payload if the token is valid.
 * @throws Error if the token is invalid, expired, or verification fails.
 */
export async function verifyToken(token: string): Promise<JwtPayloadProps> {
  if (!secret) {
    throw new Error("JWT secret is not defined in the environment variables.");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayloadProps;

    return decoded; // Return the decoded token
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token or signature");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    throw new Error("Error during token verification");
  }
}
