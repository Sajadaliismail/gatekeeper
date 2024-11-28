export interface LoginFormProps {
  email: string;
  password: string;
}

export interface LoginErrorProps {
  email: string;
  password: string;
}

export interface editUserProps {
  name: string;
  address: string;
  email: string;
}

export interface UserData {
  name: string;
  email: string;
  error?: string;
  role: string;
  address: string;
  users: UserDetails[];
}

export interface loginData {
  role: string;
  error: string;
  token: string;
  email: string;
}

export interface UserDetails {
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
}

export interface signupFormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface signupFormData {
  name: string;
  email: string;
  password: string;
}

export interface SignupErrorProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface changeRoleProps {
  email: string;
  role: string;
}

export interface changeStatusProps {
  email: string;
  isBanned: boolean;
}

export interface deleteUser {
  email: string;
}
