import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUser, loginThunk, signupThunk } from "./authAsyncThunks";
import { UserDetails } from "../../interface/interfaceProps";

interface AuthSliceProps {
  role: string | null;
  email: string;
  isLoggedIn: boolean;
  error?: string;
  loading: boolean;
  name: string;
  address: string;
  users: UserDetails[];
}

const initialState: AuthSliceProps = {
  email: "",
  error: "",
  isLoggedIn: false,
  role: null,
  name: "",
  loading: false,
  address: "",
  users: [],
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.address = "";
      state.email = "";
      state.name = "";
      state.role = null;
    },
    clearError: (state) => {
      state.error = "";
    },
    filterUsers: (state, action: PayloadAction<{ email: string }>) => {
      state.users = state.users.filter(
        (user) => user.email !== action.payload.email
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload?.role;
        state.isLoggedIn = true;
        state.email = action.payload.email;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload?.name;
        state.address = action.payload.address;
        state.users = action.payload.users;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload?.error;
      });
  },
});

export const { logout, clearError, filterUsers } = AuthSlice.actions;
export default AuthSlice.reducer;
