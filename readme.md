# GateKeeper

GateKeeper is a MERN stack application with Role-Based Access Control (RBAC). It leverages JWT for secure authentication and implements clean architecture for the backend. The application supports different user roles with specific permissions, such as **Admin**, **User**, and **Moderator**, each with varying levels of access to the dashboard and resources.

### Features

- **Authentication & Authorization**:
  - Users can **register**, **log in**, and **log out** securely using **JWT**.
  - Passwords are hashed using **bcrypt** for security.
  - **Role-Based Access Control (RBAC)** ensures that users only access resources they are authorized to based on their role.
- **Role-Based Features**:

  - **Users**: Can access their personal dashboard, view, and edit their own information.
  - **Admin**: Can view all users, edit roles, delete accounts, and modify ban status.
  - **Moderator**: Can change the ban status of any user but cannot modify roles or delete accounts.

- **Middleware**:
  - A token validation middleware checks the JWT and extracts the user role.
  - An authorization middleware ensures that users can only access routes they are allowed to, based on their role.

### Endpoints

- **POST /login**: Login a user and return a JWT token.
- **POST /signup**: Register a new user.
- **GET /**: Access for all users.
- **POST /delete-user**: For Admins and Users to delete a user.
- **POST /change-status**: For Admins and Moderators to change the ban status of a user.
- **POST /edit-user**: For Users to edit their own data.
- **POST /change-role**: For Admins to change a user's role.

### How to Run the Application

1. Clone the repository:

   ```bash
   git clone https://github.com/sajadaliismail/gatekeeper.git
   ```

2. Install dependencies for both the frontend and backend:

   - Navigate to the backend directory and run:
     ```bash
     npm install
     ```
   - Navigate to the frontend directory and run:
     ```bash
     npm install
     ```

3. Create a `.env` file in both the backend and frontend directories with the following variables:

   - Backend `.env`:
     ```
     MONGO_URI=your_mongo_db_connection_string
     FRONTEND_URL=your_frontend_url_for_cors
     JWT_SECRET=your_jwt_secret_key
     ```
   - Frontend `.env`:
     ```
     REACT_APP_API_URL=your_backend_api_url
     ```

4. To run the backend:

   ```bash
   npm run dev
   ```

5. To run the frontend:

   ```bash
   npm run start
   ```

6. For production, build both the frontend and backend and run them.

### Deployment

- **Backend** is deployed on **AWS**.
- **Frontend** is deployed on **Vercel**.
- **HTTPS** is enabled using **NGINX** to provide a secure protocol.

### Redux State Management

- The application uses **Redux** for global state management. The Redux store holds the state for user authentication, user roles, and dashboard data.

### Security

- Passwords are securely stored using **bcrypt** hashing.
- **JWT** tokens are used to manage authentication and sessions.
- Middleware validates the token and ensures proper role-based access control.

### Technologies Used

- **Frontend**: React, Redux, Axios, TailwindCSS, Vercel
- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt, AWS, NGINX
- **Middleware**: JWT Authentication, Role-Based Access Control (RBAC)
- **Deployment**: AWS (Backend), Vercel (Frontend)

### Contributing

1. Fork the repository.
2. Create your branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
