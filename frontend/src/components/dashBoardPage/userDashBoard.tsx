import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store/store";
import { useAppDispatch } from "../../features/hooks/useAppDisptach";
import { editUser } from "../../features/auth/authAsyncThunks";

// Define the structure for user data to be edited
interface UserData {
  name: string;
  address: string;
}

// UserProfile component to display and edit user profile information
export function UserProfile() {
  // Get user details from the Redux store
  const { name, email, address } = useSelector(
    (state: RootState) => state.auth
  );

  // Initialize state for editable user data and editing mode
  const [userData, setUserData] = useState<UserData>({
    address,
    name,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Hook to dispatch actions to Redux store
  const dispatch = useAppDispatch();

  // Handle input changes and update the state
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Dispatch editUser action with updated user data
    const response = await dispatch(editUser({ ...userData, email }));
    if (editUser.fulfilled.match(response)) {
      setIsEditing(false); // Exit editing mode on successful update
    }
  };

  // Cancel editing and reset user data to initial state
  const handleCancel = () => {
    setIsEditing(false);
    setUserData({
      address,
      name,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 sm:w-3/4 w-[90vw] mx-auto">
      {/* Profile header */}
      <h2 className="text-2xl font-bold mb-4">Welcome {name.toUpperCase()}</h2>
      <p className="text-gray-600 mb-6">
        View and edit your profile information
      </p>

      {/* Profile form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable input if not editing
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
            />
          </div>

          {/* Email display (not editable) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <p>{email}</p>
          </div>

          {/* Address input */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={userData.address}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable textarea if not editing
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Action buttons */}
        {isEditing ? (
          <div className="flex flex-row gap-2">
            {/* Cancel button */}
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>

            {/* Save changes button */}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        ) : (
          // Edit profile button
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
}
