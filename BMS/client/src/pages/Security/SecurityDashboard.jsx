import React, { useEffect, useState } from "react";
import { FaPersonBooth, FaBuilding, FaSearch, FaUserShield, FaCalendarCheck, FaExclamationTriangle, FaUserClock, FaIdCard, FaClipboardList, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { BsGraphUpArrow, BsShieldCheck } from "react-icons/bs";
import { MdSecurity, MdEmergencyShare, MdNotificationsActive } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { getVisitorAnalyticsThunk, getVisitorCountThunk } from "../../store/thunks/visitor.thunk";
import { useDispatch, useSelector } from "react-redux";
import { getAllTenantsThunk } from "../../store/thunks/auth.thunk";
import { getAlertStatsThunk } from "../../store/thunks/alert.thunk";
import ErrorInterface from "../../chunksComponents/ErrorInterface";



const SecurityDashboard = () => {
  const dispatch = useDispatch();
  const { visitorsStatistics, loading, error } = useSelector((state) => state.visitors);
  const { alertStats } = useSelector((state) => state.alert);
  const { tenants } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [page, setPage] = useState({
    currentPage: 1,
    totalPage: 1,
    limit: 4,
    skip: 1,
  });
  const rowsPerPage = 5;
  const { isDarkMode } = useTheme();

  // Quick action buttons data
  const quickActions = [
    { icon: FaUserShield, label: "New Guard", action: () => console.log("New Guard") },
    { icon: FaCalendarCheck, label: "Schedule", action: () => console.log("Schedule") },
    { icon: FaExclamationTriangle, label: "Report Issue", action: () => console.log("Report") },
    { icon: FaIdCard, label: "Access Cards", action: () => console.log("Access Cards") },
  ];

  // Recent activities data
  const recentActivities = [
    { id: 1, type: "entry", description: "New visitor entry - John Smith", time: "2 mins ago" },
    { id: 2, type: "alert", description: "Emergency door opened - Block A", time: "15 mins ago" },
    { id: 3, type: "guard", description: "Guard shift change - Floor 3", time: "1 hour ago" },
    { id: 4, type: "maintenance", description: "Security camera maintenance", time: "2 hours ago" },
  ];

  // Filter users based on search and role filter
  const tenantsArray = tenants?.data || [];
  const filteredUsers = tenantsArray.filter(user => {
    const matchedValue = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = matchedValue;
    const matchesFilter = selectedFilter === "all" || user.role.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const nextPage = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
  };
  const prevPage = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
  };

  useEffect(() => {
    const fetchUsers = () => {
      dispatch(getVisitorAnalyticsThunk());
      dispatch(getVisitorCountThunk());
      dispatch(getAlertStatsThunk());

    };
    fetchUsers();
  }, [dispatch]);


  useEffect(() => {
    dispatch(getAllTenantsThunk(page));
  }, [dispatch, page]);

  const nextPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
  };

  const prevPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
  };
  const StatCard = ({ title, value, icon: Icon, iconBgColor = "bg-blue-600", trend = "+5%" }) => (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-300 hover:scale-102 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <h1 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </h1>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <div className={`${iconBgColor} p-3 rounded-lg shadow-md`}>
              <Icon className="text-xl text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </span>
              <span className={`text-xs font-medium ${trend.startsWith('+')
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
                }`}>
                {trend}
              </span>
            </div>
          </div>
          <BsGraphUpArrow className={`text-lg ${iconBgColor.replace('bg-', 'text-')} dark:text-white`} />
        </div>
      </div>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 w-full rounded-xl transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <Icon className="text-xl text-blue-600 dark:text-blue-400" />
      <span className="font-medium text-gray-800 dark:text-white text-sm lg:text-base">{label}</span>
    </button>
  );

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>)
      }
      {
        error && (
          <ErrorInterface error={error} onRetry={() => dispatch(getVisitorAnalyticsThunk())} />
        )
      }
      {!loading && !error && (<div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {quickActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.action}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            title="Total Visitors Today"
            value={visitorsStatistics?.todaysVisitors || 0}
            icon={FaPersonBooth}
            iconBgColor="bg-blue-600"
            trend="+12%"
          />
          <StatCard
            title="Check In Visitors"
            value={visitorsStatistics?.checkInVisitors || 0}
            icon={MdSecurity}
            iconBgColor="bg-emerald-600"
            trend="+2%"
          />
          <StatCard
            title="Total Tenants"
            value={tenantsArray.length || 0}
            icon={FaBuilding}
            iconBgColor="bg-violet-600"
            trend="+8%"
          />
          <StatCard
            title="Active Alerts"
            value={alertStats?.totalAlert || 0}
            icon={MdEmergencyShare}
            iconBgColor="bg-red-600"
            trend={alertStats?.totalAlert ? `+${alertStats?.totalAlert}%` : "+0%"}
          />
        </div>

        {/* Recent Activities and Users Table Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Recent Activities */}
          {/* <div className="lg:col-span-1 rounded-xl shadow-md bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className={`p-2 rounded-full shadow-md ${
                  activity.type === 'alert' ? 'bg-red-500' :
                  activity.type === 'entry' ? 'bg-emerald-500' :
                  activity.type === 'guard' ? 'bg-blue-500' : 'bg-amber-500'
                }`}>
                  {activity.type === 'alert' && <MdNotificationsActive className="text-white text-lg" />}
                  {activity.type === 'entry' && <FaUserClock className="text-white text-lg" />}
                  {activity.type === 'guard' && <BsShieldCheck className="text-white text-lg" />}
                  {activity.type === 'maintenance' && <FaClipboardList className="text-white text-lg" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

          {/* Users Table Section */}
          <div className="lg:col-span-3 rounded-xl shadow-md bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="overflow-auto h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3 rounded-tl-lg">Image</th>
                      <th scope="col" className="px-4 sm:px-6 py-3">Name</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 hidden md:table-cell">Email</th>
                      <th scope="col" className="px-4 sm:px-6 py-3">Role</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 hidden sm:table-cell">Contact</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 hidden lg:table-cell rounded-tr-lg">Office</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-4 sm:px-6 py-4">
                          <img
                            src={user.image || "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"}
                            alt={user.username}
                            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : user.role === 'Tenant' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-300">
                          {user.contactNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell text-gray-600 dark:text-gray-300">
                          {user?.office?.name || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="hidden sm:flex sm:items-center sm:justify-between mt-4 px-3">
              <div className="flex-1 flex items-center justify-between">
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Page <span className="font-medium">{page.currentPage}</span> of{' '}
                  <span className="font-medium">{tenants?.pagination?.totalPages || 1}</span>
                </div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={prevPageHandle}
                    disabled={page.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${isDarkMode
                      ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(tenants?.pagination?.totalPages || 1)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage({ ...page, currentPage: index + 1 })}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page.currentPage === index + 1
                        ? isDarkMode
                          ? 'z-10 bg-blue-900/50 border-blue-500 text-blue-300'
                          : 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={nextPageHandle}
                    disabled={page.currentPage === (tenants?.pagination?.totalPages || 1)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${isDarkMode
                      ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>)}
    </>
  );
};

export default SecurityDashboard;
