import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store/store";
import { UserDetails } from "../../interface/interfaceProps";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import UserDetailsRow from "./userDetails";

export function UserList() {
  const { users, role } = useSelector((state: RootState) => state.auth);

  const [filteredUsers, setFilteredUsers] = useState<UserDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "email">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const usersPerPage = 5;

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const sortedAndFilteredUsers = useMemo(() => {
    return filteredUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [filteredUsers, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedAndFilteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const handleSort = (field: "name" | "email") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  return (
    <div className="bg-white shadow rounded-lg mx-auto w-full max-w-4xl overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Management
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage user roles, ban status, and delete users
        </p>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded-md">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline-block w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDown className="inline-block w-4 h-4 ml-1" />
                  ))}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                {sortField === "email" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline-block w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDown className="inline-block w-4 h-4 ml-1" />
                  ))}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ban Status
              </th>
              {role === "admin" && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.email}>
                <UserDetailsRow user={user} key={user.email} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
