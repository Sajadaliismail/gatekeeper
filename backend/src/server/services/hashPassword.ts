import bcrypt from "bcrypt";

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @param password - The plain-text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 5; // Number of salt rounds for bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Compares a plain-text password with a hashed password to verify if they match.
 *
 * @param password - The plain-text password provided by the user.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns A promise that resolves to `true` if passwords match, otherwise `false`.
 */
export async function passwordCompare(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
