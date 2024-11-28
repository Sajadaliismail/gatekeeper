import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changeRoleProps,
  changeStatusProps,
  deleteUser,
  editUserProps,
  loginData,
  LoginFormProps,
  signupFormData,
  UserData,
} from "../../interface/interfaceProps";

interface RejectValue {
  error: string;
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const loginThunk = createAsyncThunk<
  loginData, // Resolved type when fulfilled
  LoginFormProps, // Argument type
  { rejectValue: RejectValue } // Reject value type
>("auth/login", async (formData: LoginFormProps, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data: loginData = await response.json();

    if (!response.ok) {
      // Reject with an error message from the response or a default one
      return rejectWithValue({ error: data?.error || "Login failed" });
    }

    return data;
  } catch (error) {
    // Handle unexpected errors
    return rejectWithValue({
      error: "An unexpected error occurred during login",
    });
  }
});

export const signupThunk = createAsyncThunk<
  void, // Resolved type when fulfilled
  signupFormData, // Argument type
  { rejectValue: RejectValue } // Reject value type
>("auth/signup", async (formData: signupFormData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Reject with an error message from the response or a default one
      return rejectWithValue({ error: data?.error || "Signup failed" });
    }

    return data;
  } catch (error) {
    console.log(error);

    // Handle unexpected errors
    return rejectWithValue({
      error: "An unexpected error occurred during Signup",
    });
  }
});

export const editUser = createAsyncThunk<
  UserData,
  editUserProps,
  { rejectValue: RejectValue }
>("auth/edit-user", async (formdata, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/edit-user`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
      body: JSON.stringify(formdata),
    });

    const data = await response.json();
    if (!response.ok) return rejectWithValue({ error: data.error });
    return data;
  } catch (error) {
    return rejectWithValue({
      error: "Error occured when updating the user data",
    });
  }
});

export const getUser = createAsyncThunk<
  UserData,
  void,
  { rejectValue: RejectValue }
>("auth/get-user", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) return rejectWithValue({ error: data.error || "" });
    return data;
  } catch (error) {
    return rejectWithValue({
      error: "Error occured when updating the user data",
    });
  }
});

export const changeRole = createAsyncThunk<
  boolean,
  changeRoleProps,
  { rejectValue: RejectValue }
>("auth/change-role", async (formData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/change-role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) return rejectWithValue({ error: data.error || "" });
    return data;
  } catch (error) {
    return rejectWithValue({
      error: "Error occured when updating the user data",
    });
  }
});

export const changeStatus = createAsyncThunk<
  boolean,
  changeStatusProps,
  { rejectValue: RejectValue }
>("auth/change-status", async (formData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/change-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) return rejectWithValue({ error: data.error || "" });
    return data;
  } catch (error) {
    return rejectWithValue({
      error: "Error occured when updating the user data",
    });
  }
});

export const removeUser = createAsyncThunk<
  boolean,
  deleteUser,
  { rejectValue: RejectValue }
>("auth/remove-user", async (formData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/delete-user`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }, // Include headers
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) return rejectWithValue({ error: data.error || "" });
    return data;
  } catch (error) {
    return rejectWithValue({
      error: "Error occured when updating the user data",
    });
  }
});
