import { LoginFormProps, signupFormProps } from "../interface/interfaceProps";

interface validatorLogin {
  errors: LoginFormProps;
  error: boolean;
}
export const loginFormValidator = (data: LoginFormProps): validatorLogin => {
  const errors: LoginFormProps = { email: "", password: "" };
  let error = false;
  // Loop through each field and validate
  for (let [key, value] of Object.entries(data)) {
    if (key === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(value)) {
        errors[key] = "invalid email format";
        error = true;
      }
    } else if (!value.trim()) {
      errors[key as keyof LoginFormProps] = "Invalid entry";
      error = true;
    }
  }

  return { error, errors };
};

interface validatorSignup {
  errors: signupFormProps;
  error: boolean;
}

export const signupFormValidator = (data: signupFormProps): validatorSignup => {
  const errors: signupFormProps = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  };

  let error = false;

  // Loop through each field and validate
  for (let [key, value] of Object.entries(data)) {
    if (key === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(value)) {
        errors[key] = "invalid email format";
        error = true;
      }
    } else if (key === "name") {
      const namePattern = /^[a-zA-Z\s]+$/;
      if (!namePattern.test(value) || !value.trim()) {
        errors[key] = "invalid name";
        error = true;
      }
    } else if (!value.trim()) {
      errors[key as keyof signupFormProps] = "Invalid entry";
      error = true;
    }
  }

  return { error, errors };
};
