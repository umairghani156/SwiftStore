import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaSpinner, FaTimes, FaUserCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getAllUsersThunk } from "../../store/thunks/auth.thunk";

const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    contact: "+1234567890",
    office: "New York",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    contact: "+0987654321",
    office: "Los Angeles",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Manager",
    contact: "+1122334455",
    office: "Chicago",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob.brown@example.com",
    role: "User",
    contact: "+5566778899",
    office: "Miami",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    role: "Admin",
    contact: "+6677889900",
    office: "Houston",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 6,
    name: "David White",
    email: "david.white@example.com",
    role: "User",
    contact: "+2233445566",
    office: "Dallas",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 7,
    name: "Emma Miller",
    email: "emma.miller@example.com",
    role: "Manager",
    contact: "+3344556677",
    office: "San Francisco",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 8,
    name: "Frank Harris",
    email: "frank.harris@example.com",
    role: "User",
    contact: "+4455667788",
    office: "Boston",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 9,
    name: "Grace Lewis",
    email: "grace.lewis@example.com",
    role: "Admin",
    contact: "+5566778899",
    office: "Seattle",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 10,
    name: "Henry Clark",
    email: "henry.clark@example.com",
    role: "User",
    contact: "+6677889900",
    office: "Portland",
    img: "/assets/images/login-bg.jpg",
  },
  {
    id: 11,
    name: "Ivy Young",
    email: "ivy.young@example.com",
    role: "Manager",
    contact: "+7788990011",
    office: "Denver",
    img: "/assets/images/login-bg.jpg",
  },
];

const AllUsers = () => {
  const dispatch = useDispatch();
  const {users} = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserData, setEditUserData] = useState(null);
 // const [users, setUsers] = useState(usersData);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const rowsPerPage = 5;

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.office.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const editUser = (user) => {
    setEditUserData(user);
    setShowModal(true);
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedUsers = users.map((user) =>
      user.id === editUserData.id ? editUserData : user
    );
    setUsers(updatedUsers);
    setShowModal(false);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "User":
        return "bg-blue-100 text-blue-800";
      case "Manager":
        return "bg-green-100 text-green-800";
      case "Security":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(()=>{
   function getAllUsers(){
    dispatch(getAllUsersThunk());
   }
   getAllUsers();
  },[])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor all users in the system
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">Tenant</option>
              <option value="Manager">Office Manager</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Mobile View */}
        <div className="block sm:hidden">
            {currentUsers.map((user) => (
            <div key={user.id} className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {user.img ? (
                  <img
                    src={user.img}
                    alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => editUser(user)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(user.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="block text-xs text-gray-400">Contact</span>
                  {user.contact}
                </div>
                <div>
                  <span className="block text-xs text-gray-400">Office</span>
                  {user.office}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Office
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.img ? (
                          <img
                            src={user.img}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-500">{user.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">{user.office}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => editUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
        <button
            onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
            Previous
        </button>
        <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage * rowsPerPage >= filteredUsers.length}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstUser + 1}</span>
              {" - "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredUsers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(Math.ceil(filteredUsers.length / rowsPerPage))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * rowsPerPage >= filteredUsers.length}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editUserData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editUserData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={editUserData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">Tenant</option>
                  <option value="Manager">Office Manager</option>
                  <option value="Security">Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={editUserData.contact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Office
                </label>
                <input
                  type="text"
                  name="office"
                  value={editUserData.office}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDelete)}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default AllUsers;
