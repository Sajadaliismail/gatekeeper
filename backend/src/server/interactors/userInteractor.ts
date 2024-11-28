import { IUser } from "../models/userSchema";
import { UserRepository } from "../repositories/userRepository";
import { hashPassword } from "../services/hashPassword";

/**
 * Business logic layer for user-related operations.
 * This class acts as an intermediary between the controller and repository layers,
 * ensuring separation of concerns and clean architecture principles.
 */
export class UserInteractor {
  private userRepository: UserRepository;

  /**
   * Initializes the UserInteractor with a UserRepository instance.
   * Using dependency injection facilitates testing and enhances modularity.
   */
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Retrieves all user data from the databasse.
   * Delegates the database interaction to the UserRepository.
   *
   * @returns All users data as an array.
   */
  async findAllUsers() {
    return await this.userRepository.findAllUsers();
  }

  /**
   * Finds a user by their email.
   * Delegates the database interaction to the UserRepository.
   *
   * @param email - Email of the user to find.
   * @returns The user data if found, or null if no user exists with the provided email.
   */
  async getUserDetails(email: string) {
    return await this.userRepository.getUserDetails(email);
  }

  /**
   * Finds a user by their email.
   * Delegates the database interaction to the UserRepository.
   *
   * @param email - Email of the user to find.
   * @returns The user data if found, or null if no user exists with the provided email.
   */
  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Removes a user by their email.
   * Delegates the database interaction to the UserRepository.
   *
   * @param email - Email of the user to find.
   * @returns The status of deleteion, Boolean
   */
  async removeUserByEmail(email: string) {
    return await this.userRepository.removeByEmail(email);
  }

  /**
   * Updates a user using email
   * Delegates the database interaction to the UserRepository.
   *
   * @param email - Email of the user to find.
   * @param data - Data to be updated
   * @returns The updated data.
   */
  async findByEmailAndUpdate(email: string, data: Partial<IUser>) {
    console.log(data);

    return await this.userRepository.updateUser(email, data);
  }

  /**
   * Creates a new user with hashed password.
   * Handles password hashing before delegating the user creation to the repository layer.
   *
   * @param userData - The data of the user to be created (name, email, password, etc.).
   * @returns The created user data as returned by the repository.
   */
  async createUser(userData: IUser) {
    const { password } = userData;

    // Hash the user's password before saving it to the database
    const hashedPassword = await hashPassword(password);
    userData.password = hashedPassword;

    // Delegate the user creation to the repository
    return await this.userRepository.createUser(userData);
  }
}
