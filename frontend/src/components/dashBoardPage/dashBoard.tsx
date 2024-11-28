import { useSelector } from "react-redux";
import { RootState } from "../../features/store/store";
import { UserProfile } from "./userDashBoard";
import { UserList } from "./adminDashBoard";
import { useAppDispatch } from "../../features/hooks/useAppDisptach";
import { logout } from "../../features/auth/authSlice";
import { useEffect } from "react";
import { getUser } from "../../features/auth/authAsyncThunks";

export default function DashBoard() {
  // Extract `role` and `loading` state from Redux store
  const { role, loading } = useSelector((state: RootState) => state.auth);

  // Hook to dispatch actions
  const dispatch = useAppDispatch();

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Handle user logout
  const handleLogout = async () => {
    await dispatch(logout());
  };

  // Render nothing while loading user data
  if (loading) return null;

  return (
    <div className="min-h-[100vh] flex items-center relative">
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute right-5 top-5 bg-red-600 text-white text-xl h-12 px-3 
        rounded-md shadow-xl hover:scale-105 transition-transform duration-300"
      >
        Logout
      </button>

      {/* Conditional rendering based on user role */}
      {role === "user" && <UserProfile />}
      {(role === "admin" || role === "moderator") && <UserList />}
    </div>
  );
}
