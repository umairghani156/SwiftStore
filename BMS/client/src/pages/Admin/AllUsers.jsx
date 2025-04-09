import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaSpinner, FaTimes, FaUserCircle, FaDownload, FaSort } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from '../../context/ThemeContext';
import { deleteUserThunk, getAllUsersThunk, updateUserThunk } from "../../store/thunks/auth.thunk";
import { useDispatch, useSelector } from "react-redux";
import { getOfficeThunk } from "../../store/thunks/office.thunk";

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
  const { users, loading: usersLoading, error } = useSelector((state) => state.auth);
  const {office} = useSelector((state) => state.office);
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserData, setEditUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const rowsPerPage = 8;

  useEffect(() => {
    function fetchUsers() {
      dispatch(getAllUsersThunk());
      dispatch(getOfficeThunk());
    }

    fetchUsers();
  }, []);

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
    if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
    return 0;
  });

  // Filter users based on search term and role
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user?.username.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm?.toLowerCase())
     const matchesRole = filterRole === "all" || user?.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Contact', 'Office'];
    const csvData = filteredUsers.map(user =>
      [user.name, user.email, user.role, user.contact, user.office].join(',')
    );

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  };

  const editUser = (user) => {
    setEditUserData(user);
    setShowModal(true);
  };

  //TODO
  const deleteUser = async (id) => {
    setLoading(true);

    try {
      // Update state first with the filtered users
     dispatch(deleteUserThunk(id));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      const res = await dispatch(updateUserThunk(editUserData));
      if (res.payload.success) {
         setShowModal(false);
       
      }

    } catch (error) {
     console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleInputChange = (e) => {
  //   const { username, value } = e.target;
  //   setEditUserData({ ...editUserData, [username]: value });
  // };

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

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <FaSort className="ml-1 text-gray-400 inline" />;
    }
    return sortConfig.direction === 'asc' ?
      <FaSort className="ml-1 text-blue-500 inline" /> :
      <FaSort className="ml-1 text-blue-500 inline rotate-180" />;
  };

  // Edit User Modal
  const EditUserModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}></div>
        </div>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Edit User
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`rounded-md p-1 hover:bg-opacity-75 transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                  >
                    <FaTimes />
                  </button>
      </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                      value={editUserData?.username}
                      onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'border-gray-300 text-gray-900'
                        }`}
                />
              </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                      value={editUserData?.email || ''}
                      onChange={(e)=> setEditUserData({ ...editUserData, email: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'border-gray-300 text-gray-900'
                        }`}
                />
              </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role
                </label>
                    <select
                  name="role"
                      value={editUserData?.role || ''}
                      onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Office Manager">Manager</option>
                      <option value="Security">Security</option>
                    </select>
              </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                      value={editUserData?.contactNumber || ''}
                      onChange={(e)=> setEditUserData({...editUserData, contactNumber: e.target.value})}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'border-gray-300 text-gray-900'
                        }`}
                />
              </div>
                  
                  <div>
                    <label id="officeEdit" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Office
                </label>
                    <select
                      value={editUserData?.office._id || ''}
                      onChange={(e) => setEditUserData({ ...editUserData, office: e.target.value })}
                     name="office" id="officeEdit" className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'border-gray-300 text-gray-900'
                        }`}>
                    {
                      office.map((office) => (
                        <option key={office._id} value={office._id}>{office.officeName}</option>
                      ))
                    }
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50'
            }`}>
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={loading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:w-auto sm:text-sm ${isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isDarkMode ? 'bg-red-900' : 'bg-red-100'
                }`}>
                <FaTrash className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete User
                </h3>
                <div className="mt-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50'
            }`}>
            <button
              type="button"
              onClick={() => deleteUser(confirmDelete)}
              disabled={loading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:w-auto sm:text-sm ${isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
   <>
   { usersLoading ? (
    <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
   ) :
     (<>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`rounded-lg shadow-sm p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>All Users</h1>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  Manage and monitor all users in the system
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={exportToCSV}
                  className={`inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-500 border-blue-500'
                      : 'bg-blue-600 hover:bg-blue-700 border-transparent'
                    }`}
                >
                  <FaDownload className="mr-2" />
                  Export Users
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={`rounded-lg shadow-sm p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className={`pl-10 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Office Manager">Office Manager</option>
                  <option value="Security">Security</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className={`rounded-lg shadow-sm overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
            {/* Mobile View */}
            <div className="block sm:hidden">
              {currentUsers.map((user) => (
                <div
                  key={user._id}
                  className={`p-4 border-b transition-colors duration-200 ${isDarkMode
                      ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.username}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className={`h-12 w-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                        {user.username}
                      </p>
                      <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{user.email}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode
                            ? user.role === "Admin"
                              ? "bg-purple-900 text-purple-100"
                              : user.role === "User"
                                ? "bg-blue-900 text-blue-100"
                                : user.role === "Manager"
                                  ? "bg-green-900 text-green-100"
                                  : "bg-yellow-900 text-yellow-100"
                            : getRoleBadgeClass(user.role)
                          }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => editUser(user)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700'
                            : 'text-blue-600 hover:text-blue-800'
                          }`}
                        aria-label="Edit user"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user._id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                            ? 'text-red-400 hover:text-red-300 hover:bg-gray-700'
                            : 'text-red-600 hover:text-red-800'
                          }`}
                        aria-label="Delete user"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className={`mt-2 grid grid-cols-2 gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    <div>
                      <span className={`block text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>Contact</span>
                      {user.contactNumber}
                    </div>
                    <div>
                      <span className={`block text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>Office</span>
                      {user?.office?.officeName}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} onClick={() => handleSort('name')}>
                      Name
                      <SortIcon column="name" />
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} onClick={() => handleSort('email')}>
                      Email
                      <SortIcon column="email" />
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} onClick={() => handleSort('role')}>
                      Role
                      <SortIcon column="role" />
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} onClick={() => handleSort('office')}>
                      Office
                      <SortIcon column="office" />
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`transition-colors duration-200 ${isDarkMode
                          ? 'hover:bg-gray-700/50'
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className={`h-10 w-10 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                                }`} />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                              }`}>
                              {user.username}
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                              {user.contactNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode
                            ? user.role === "Admin"
                              ? "bg-purple-900 text-purple-100"
                              : user.role === "User"
                                ? "bg-blue-900 text-blue-100"
                                : user.role === "Manager"
                                  ? "bg-green-900 text-green-100"
                                  : "bg-yellow-900 text-yellow-100"
                            : getRoleBadgeClass(user.role)
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                        {user?.office?.name ? user?.office?.name : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => editUser(user)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                                ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700'
                                : 'text-blue-600 hover:text-blue-800'
                              }`}
                            aria-label="Edit user"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(user._id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                                ? 'text-red-400 hover:text-red-300 hover:bg-gray-700'
                                : 'text-red-600 hover:text-red-800'
                              }`}
                            aria-label="Delete user"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <div className={`flex flex-col sm:flex-row items-center justify-between rounded-lg shadow-sm p-4 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
              <div className="mb-4 sm:mb-0">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Showing{" "}
                  <span className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>{indexOfFirstUser + 1}</span>
                  {" - "}
                  <span className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>{filteredUsers.length}</span> results
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${isDarkMode
                      ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                >
                  Previous
                </button>
                <div className="hidden sm:flex space-x-2">
                  {[...Array(Math.ceil(filteredUsers.length / rowsPerPage))].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-150 ${currentPage === index + 1
                          ? isDarkMode
                            ? "z-10 bg-blue-900 border-blue-500 text-blue-100"
                            : "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : isDarkMode
                            ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * rowsPerPage >= filteredUsers.length}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${isDarkMode
                      ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>

      {/* Modals */}
      {showModal && <EditUserModal />}
      {confirmDelete && <DeleteConfirmationModal />}
    </>)}
    </>
  );
};

export default AllUsers;