import { useState } from "react";
import { loginThunk, signupThunk } from "../../features/auth/authAsyncThunks";
import { useAppDispatch } from "../../features/hooks/useAppDisptach";
import {
  loginFormValidator,
  signupFormValidator,
} from "../../utilities/validators";
import {
  LoginErrorProps,
  LoginFormProps,
  SignupErrorProps,
  signupFormProps,
} from "../../interface/interfaceProps";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store/store";
import { clearError } from "../../features/auth/authSlice";

const loginState = {
  email: "",
  password: "",
};

const signupForm = {
  email: "",
  password: "",
  name: "",
  confirmPassword: "",
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { error } = useSelector((state: RootState) => state.auth);

  const [loginFormData, setLoginFormData] =
    useState<LoginFormProps>(loginState);

  const [loginFormError, setLoginFormError] =
    useState<LoginErrorProps>(loginState);

  const [signupFormData, setSignupFormData] =
    useState<signupFormProps>(signupForm);

  const [signupFormError, setSignupFormError] =
    useState<SignupErrorProps>(signupForm);

  const dispatch = useAppDispatch();

  const handleLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setLoginFormError((prev) => {
      return { ...prev, [name]: "" };
    });
    setLoginFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSignupForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setSignupFormData((prev) => {
      return { ...prev, [name]: value };
    });
    setSignupFormError((prev) => {
      return { ...prev, [name]: "" };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      setSignupFormData(signupForm);

      const validate = loginFormValidator(loginFormData);
      if (!validate.error) {
        await dispatch(loginThunk(loginFormData));
      } else setLoginFormError(validate.errors);
    } else {
      setLoginFormData(loginState);
      if (signupFormData.password !== signupFormData.confirmPassword) {
        setSignupFormError((prev) => {
          return { ...prev, confirmPassword: "Passwords do not match" };
        });
        return;
      }

      const validate = signupFormValidator(signupFormData);
      if (!validate.error) {
        const signup = await dispatch(signupThunk(signupFormData));
        if (signupThunk.fulfilled.match(signup)) {
          handleChangePane();
          setLoginFormData((prev) => {
            return { ...prev, email: signupFormData.email };
          });
          setSignupFormData(signupForm);
        }
      } else setSignupFormError(validate.errors);
    }
  };

  const handleChangePane = async () => {
    await dispatch(clearError());
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl sm:text-6xl font-semibold text-center">
          GateKeeper
        </h1>
        <div>
          <h2 className="mt-6 text-center sm:text-3xl font-extrabold text-gray-900 ">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>
        <div className="mt-8 relative">
          <div className="overflow-hidden">
            <div
              className="transition-transform duration-200 ease-in-out transform"
              style={{ transform: `translateX(${isLogin ? "0%" : "-100%"})` }}
            >
              <div className="flex">
                {/* Login Form */}
                <form className="w-full flex-shrink-0" onSubmit={handleSubmit}>
                  <div className="rounded-md shadow-sm flex flex-col gap-4 ">
                    <div>
                      <label htmlFor="login-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                          loginFormError.email && "border-red-600 "
                        }`}
                        placeholder="Email address"
                        value={loginFormData.email}
                        onChange={handleLoginForm}
                      />
                    </div>
                    <div>
                      <label htmlFor="login-password" className="sr-only">
                        Password <span>asd</span>
                      </label>
                      <input
                        id="login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                          loginFormError.password && "border-red-600 "
                        }`}
                        placeholder="Password"
                        value={loginFormData.password}
                        onChange={handleLoginForm}
                      />
                    </div>
                    {error && (
                      <p className="text-center bg-red-500 text-white rounded-md ">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign in
                    </button>
                  </div>
                </form>

                {/* Signup Form */}
                <form className="w-full flex-shrink-0" onSubmit={handleSubmit}>
                  <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-3">
                    <div>
                      <label htmlFor="signup-name" className="sr-only">
                        Name
                      </label>
                      <div className="relative">
                        <input
                          id="signup-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                            signupFormError.name && "border-red-600 "
                          }`}
                          placeholder="First name"
                          value={signupFormData.name}
                          onChange={handleSignupForm}
                        />
                        <p className="absolute right-2 top-2 text-red-600">
                          {signupFormError.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="signup-email" className="sr-only">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          id="signup-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                            signupFormError.email && "border-red-600 "
                          }`}
                          placeholder="Email address"
                          value={signupFormData.email}
                          onChange={handleSignupForm}
                        />
                        <p className="absolute right-2 top-2 text-red-600">
                          {signupFormError.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="signup-password" className="sr-only">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                            signupFormError.password && "border-red-600 "
                          }`}
                          placeholder="Password"
                          value={signupFormData.password}
                          onChange={handleSignupForm}
                        />
                        <p className="absolute right-2 top-2 text-red-600">
                          {signupFormError.password}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="signup-confirm-password"
                        className="sr-only"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-confirm-password"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                            signupFormError.confirmPassword && "border-red-600 "
                          }`}
                          placeholder="Confirm password"
                          value={signupFormData.confirmPassword}
                          onChange={handleSignupForm}
                        />
                        <p className="absolute right-2 top-2 text-red-600">
                          {signupFormError.confirmPassword}
                        </p>
                      </div>
                    </div>
                    {error && (
                      <p className="text-center bg-red-500 text-white rounded-md ">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleChangePane}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
