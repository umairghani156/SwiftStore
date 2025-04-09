import React, { useEffect, useState } from 'react';
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUserShield,
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaComments,
  FaTags,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaChartLine,
  FaTimesCircle,
  FaWatchmanMonitoring,
  FaArchway,
} from 'react-icons/fa';
import { GoStopwatch } from "react-icons/go";
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getSpecialIssueThunk } from '../../store/thunks/issue.thunk';
import { format } from 'date-fns';
import ErrorInterface from '../../chunksComponents/ErrorInterface';
const IssueManagementSecurity = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { specialIssue , loading, error} = useSelector((state) => state.issue);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    location: '',
    assignedTo: '',
    status: '',
  });

  // Mock statistics data
  const stats = {
    totalIssues: 156,
    openIssues: 45,
    resolvedIssues: 111,
    criticalIssues: 8,
  };

  // Mock issues data
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Faulty CCTV Camera in Parking Area',
      description: 'Camera #12 in B2 parking level is not functioning properly',
      status: 'Open',
      priority: 'High',
      category: 'Equipment',
      location: 'Parking B2',
      assignedTo: 'John Smith',
      reportedBy: 'Security Team A',
      reportedAt: '2024-03-19 10:30',
      lastUpdated: '2024-03-19 14:45',
      comments: [
        { user: 'John Smith', text: 'Investigating the issue', timestamp: '2024-03-19 11:00' },
        { user: 'Tech Support', text: 'Replacement parts ordered', timestamp: '2024-03-19 14:45' }
      ],
      tags: ['CCTV', 'Maintenance', 'Urgent']
    },
    {
      id: 2,
      title: 'Unauthorized Access Attempt',
      description: 'Multiple failed access attempts detected at main entrance',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Security Breach',
      location: 'Main Entrance',
      assignedTo: 'Sarah Johnson',
      reportedBy: 'Access Control System',
      reportedAt: '2024-03-19 15:20',
      lastUpdated: '2024-03-19 15:45',
      comments: [
        { user: 'Sarah Johnson', text: 'Reviewing security footage', timestamp: '2024-03-19 15:30' }
      ],
      tags: ['Access Control', 'Investigation']
    },
    {
      id: 3,
      title: 'Malfunctioning Access Card Reader',
      description: 'Card reader at R&D department entrance is intermittently failing',
      status: 'Resolved',
      priority: 'Medium',
      category: 'Equipment',
      location: 'R&D Department',
      assignedTo: 'Mike Wilson',
      reportedBy: 'R&D Staff',
      reportedAt: '2024-03-19 09:15',
      lastUpdated: '2024-03-19 13:20',
      comments: [
        { user: 'Mike Wilson', text: 'Reader replaced and tested', timestamp: '2024-03-19 13:20' }
      ],
      tags: ['Hardware', 'Access Control']
    }
  ]);

  // Filter issues
  const filteredIssues = specialIssue && specialIssue.filter(issue => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || issue.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  console.log(specialIssue)

  // Priority Badge Component
  const PriorityBadge = ({ priority }) => {
    const getColor = () => {
      switch (priority?.toLowerCase()) {
        case 'critical':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'high':
          return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default:
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
        {priority}
      </span>
    );
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const getColor = () => {
      switch (status.toLowerCase()) {
        case 'open':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'in progress':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'resolved':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
        {status}
      </span>
    );
  };

  // Handle edit
  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setEditFormData({
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      category: issue.category,
      location: issue.location,
      assignedTo: issue.assignedTo,
      status: issue.status,
    });
    setShowEditModal(true);
  };

  // Handle edit submit
  const handleEditSubmit = () => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === selectedIssue.id
          ? {
            ...issue,
            ...editFormData,
            lastUpdated: new Date().toLocaleString(),
            comments: [
              ...issue.comments,
              {
                user: 'System',
                text: 'Issue details updated',
                timestamp: new Date().toLocaleString()
              }
            ]
          }
          : issue
      )
    );
    setShowEditModal(false);
    setSelectedIssue(null);
    setEditFormData({
      title: '',
      description: '',
      priority: '',
      category: '',
      location: '',
      assignedTo: '',
      status: '',
    });
  };

  // Handle delete
  const handleDelete = () => {
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== selectedIssue.id));
    setShowDeleteModal(false);
    setSelectedIssue(null);
  };

  // Edit Modal Component
  const EditModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${showEditModal ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowEditModal(false)}></div>
      <div className={`relative w-full max-w-2xl p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={() => setShowEditModal(false)}
          className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 ${isDarkMode ? 'hover:text-gray-300' : ''}`}
        >
          <FaTimes className="text-xl" />
        </button>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Edit Issue
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Title
            </label>
           <select name="title" id="" onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            className={`w-full p-2 rounded-lg border ${isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
            <option value={editFormData.title}>{editFormData.title}</option>
           </select>
          
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              rows="3"
              className={`w-full p-2 rounded-lg border ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Priority
              </label>
              <select
                value={editFormData.priority}
                onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                className={`w-full p-2 rounded-lg border ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className={`w-full p-2 rounded-lg border ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Assigned To
            </label>
            <input
              type="text"
              value={editFormData.assignedTo.name}
              onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
              className={`w-full p-2 rounded-lg border ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowEditModal(false)}
            className={`px-4 py-2 rounded-lg ${isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${showDeleteModal ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeleteModal(false)}></div>
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Confirm Delete
        </h3>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Are you sure you want to delete this issue? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className={`px-4 py-2 rounded-lg ${isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Fetch All Isues

  useEffect(() => {
    const fetchIssues = async () => {
      dispatch(getSpecialIssueThunk('Security'));
    }
    fetchIssues();
  }, []);

  return (
    <>
    {
      loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )
    }
    {
      error && (
       <ErrorInterface error={error} onRetry={() => dispatch(getSpecialIssueThunk('Security'))} />
      )
    }
   { !loading && !error && (<div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Issue Management
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and manage security-related issues
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            New Issue
          </button>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Issues"
            value={specialIssue?.length || 0}
            icon={FaChartLine}
            color="bg-blue-500"
          />
          <StatCard
            title="Pending Issues"
            value={specialIssue?.filter((issue) => issue.status === 'Pending').length || 0}
            icon={FaExclamationTriangle}
            color="bg-yellow-500"
          />
          <StatCard
            title="Resolved Issues"
            value={specialIssue?.filter((issue) => issue.status === 'Resolved').length || 0}
            icon={FaCheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="In Progress Issues"
            value={specialIssue?.filter((issue) => issue.status === 'In Progress').length || 0}
            icon={FaExclamationTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 w-full px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
                } border border-gray-300 dark:border-gray-700`}
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="all">All Categories</option>
                <option value="Equipment">Equipment</option>
                <option value="Security Breach">Security Breach</option>
                <option value="Access Control">Access Control</option>
                <option value="Surveillance">Surveillance</option>
              </select>
            </div>
          )}
        </div>

        {/* Issues Grid/List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredIssues && filteredIssues?.map((issue) => (
            <div
              key={issue._id}
              className={`p-4 sm:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                } border-l-4 ${issue.priority === 'Critical'
                  ? 'border-red-500'
                  : issue.priority === 'High'
                    ? 'border-orange-500'
                    : 'border-blue-500'
                }`}
            >
              {/* Issue Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {issue.title}
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {issue.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                   disabled={true}
                    onClick={() => handleEdit(issue)}
                    className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaEdit />
                  </button>
                  <button
                  disabled={true}
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-500 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Issue Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {issue.location || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaUserShield className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Assigned To
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {issue?.assignedTo?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaClock className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Reported
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {issue?.reportedBy.username || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaBuilding className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {issue.category || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <StatusBadge status={issue.status} />

              </div>

              {/* Comments Section */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <GoStopwatch className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {
                        issue?.createdAt
                          ? format(new Date(issue?.createdAt), 'hh:mm a')
                          : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GoStopwatch className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {
                        issue?.createdAt
                          ? format(new Date(issue?.createdAt), 'dd/MM/yyyy')
                          : 'N/A'
                      }
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modals */}
      <EditModal />
      <DeleteModal />
    </div>)}
    </>
  );
};

export default IssueManagementSecurity;
