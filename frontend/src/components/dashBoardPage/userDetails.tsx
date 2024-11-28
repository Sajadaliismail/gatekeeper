import { useSelector } from "react-redux";
import { UserDetails } from "../../interface/interfaceProps";
import { RootState } from "../../features/store/store";
import { useAppDispatch } from "../../features/hooks/useAppDisptach";
import {
  changeRole,
  changeStatus,
  removeUser,
} from "../../features/auth/authAsyncThunks";
import { useEffect, useState } from "react";
import ConfirmationModal from "../commonComponents/confirmationBox";
import { filterUsers } from "../../features/auth/authSlice";

interface UserDetailsRowProps {
  user: UserDetails;
}

// Component to display individual user details with actions
const UserDetailsRow: React.FC<UserDetailsRowProps> = ({ user }) => {
  // Fetch the current logged-in user role and email from the Redux store
  const { role, email } = useSelector((state: RootState) => state.auth);

  // State variables for handling role changes
  const [currentRole, setCurrentRole] = useState<string>("");
  const [changeToRole, setChangeToRole] = useState<string>("");
  const [modalOpenRole, setModalOpenRole] = useState<boolean>(false);

  // State variables for handling user ban status
  const [currentBanStatus, setCurrentBanStatus] = useState<boolean>(false);
  const [modalOpenBan, setModalOpenBan] = useState<boolean>(false);

  // State variable for handling user deletion
  const [modalOpenDelete, setModalOpenDelete] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  // Initialize current role and ban status when the user prop changes
  useEffect(() => {
    setCurrentRole(user.role);
    setCurrentBanStatus(user.isBanned);
  }, [user]);

  // Handle role change dropdown selection
  const handleChangeRole = async (
    email: string,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setModalOpenRole(true); // Open confirmation modal
    const role = e.target.value;
    setChangeToRole(role); // Update the selected role
  };

  // Confirm and dispatch role change
  const confirmRoleChange = async () => {
    const formData = { email: user.email, role: changeToRole };
    const changeResponse = await dispatch(changeRole(formData));

    // Update local state if the role change is successful
    if (changeRole.fulfilled.match(changeResponse)) {
      setCurrentRole(changeToRole);
      setModalOpenRole(false);
    }
  };

  // Cancel role change and close modal
  const cancelRoleChange = () => {
    setModalOpenRole(false);
  };

  // Confirm and dispatch ban status change
  const confirmBanChange = async () => {
    const formData = { email: user.email, isBanned: !currentBanStatus };
    const changeResponse = await dispatch(changeStatus(formData));

    // Update local state if the ban status change is successful
    if (changeStatus.fulfilled.match(changeResponse)) {
      setCurrentBanStatus(!currentBanStatus);
      setModalOpenBan(false);
    }
  };

  // Cancel ban status change and close modal
  const cancelBanChange = () => {
    setModalOpenBan(false);
  };

  // Handle toggle of ban status
  const handleBanStatus = () => {
    setModalOpenBan(true);
  };

  // Cancel delete user action and close modal
  const cancelDeleteChange = () => {
    setModalOpenDelete(false);
  };

  // Confirm and dispatch user deletion
  const confirmDeleteUser = async () => {
    const changeResponse = await dispatch(removeUser({ email: user.email }));

    // Update state and close modal if user deletion is successful
    if (removeUser.fulfilled.match(changeResponse)) {
      await dispatch(filterUsers({ email: user.email }));
      setModalOpenDelete(false);
    }
  };

  return (
    <>
      {/* User Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {user.name}
      </td>

      {/* User Email */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>

      {/* Role Management */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.role !== "admin" && role === "admin" ? (
          <>
            {/* Role Dropdown */}
            <select
              onChange={(e) => handleChangeRole(user.email, e)}
              value={currentRole}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>

            {/* Confirmation Modal for Role Change */}
            <ConfirmationModal
              isOpen={modalOpenRole}
              message="Are you sure you want to change the role?"
              onClose={cancelRoleChange}
              onConfirm={confirmRoleChange}
              title="Change Role"
            />
          </>
        ) : (
          <p>{user.role}</p>
        )}
      </td>

      {/* Ban Status Management */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.role !== "admin" && user.email !== email ? (
          <label className="inline-flex items-center cursor-pointer">
            <input
              onChange={handleBanStatus}
              type="checkbox"
              checked={currentBanStatus}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2">
              {currentBanStatus ? "Blacklisted" : "Whitelist"}
            </span>
          </label>
        ) : (
          <span>Active</span>
        )}

        {/* Confirmation Modal for Ban Status Change */}
        <ConfirmationModal
          isOpen={modalOpenBan}
          message="Are you sure you want to change the ban status?"
          onClose={cancelBanChange}
          onConfirm={confirmBanChange}
          title="Change Ban Status"
        />
      </td>

      {/* User Deletion */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {user.role !== "admin" && role === "admin" && (
          <button
            onClick={() => setModalOpenDelete(true)}
            className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
          >
            Delete
          </button>
        )}
      </td>

      {/* Confirmation Modal for User Deletion */}
      <ConfirmationModal
        isOpen={modalOpenDelete}
        message="Are you sure you want to delete the user?"
        onClose={cancelDeleteChange}
        onConfirm={confirmDeleteUser}
        title="Delete User"
      />
    </>
  );
};

export default UserDetailsRow;
