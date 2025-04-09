import React, { useState } from "react";
import { 
  FaPersonBooth, 
  FaTrashAlt, 
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaFilter,
  FaDownload,
  FaPlus
} from "react-icons/fa";
import { IoEnterOutline } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import AllUsers from "../Admin/AllUsers";
import ManagerAllTenants from "../../components/Manager/AllTenants";

const visitorsCards = [
  { 
    id: 1, 
    name: "Check-in Visitors", 
    count: 10, 
    icon: <IoEnterOutline />,
    trend: "+5%",
    trendUp: true,
    color: "blue"
  },
  { 
    id: 2, 
    name: "Check-out Visitors", 
    count: 8, 
    icon: <FaPersonBooth />,
    trend: "-2%",
    trendUp: false,
    color: "green"
  },
  { 
    id: 3, 
    name: "Active Visitors", 
    count: 15, 
    icon: <FaUsers />,
    trend: "+12%",
    trendUp: true,
    color: "purple"
  },
  { 
    id: 4, 
    name: "Total Tenants", 
    count: 25, 
    icon: <FaBuilding />,
    trend: "+8%",
    trendUp: true,
    color: "indigo"
  },
];

const taskPriorityColors = {
  High: "red",
  Medium: "yellow",
  Low: "green"
};

const taskStatusColors = {
  "In Progress": "yellow",
  "Resolved": "green",
  "Pending": "gray",
  "electricalUrgent": "red"
};

function ManagerDashboard() {
  const { isDarkMode } = useTheme();
  const [selectedTeam, setSelectedTeam] = useState("electrical");
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskData, setTaskData] = useState({
    plumbing: [
      {
        id: 1,
        date: "2025-02-25",
        task: "Repair leaks in Restroom 1",
        assignedTo: "Team Plumbing",
        status: "electricalUrgent",
        priority: "High",
      },
      {
        id: 2,
        date: "2025-02-25",
        task: "Clean drainpipes in Office B",
        assignedTo: "Team Plumbing",
        status: "Resolved",
        priority: "Low",
      },
      {
        id: 3,
        date: "2025-02-26",
        task: "Replace broken faucet in Conference Room",
        assignedTo: "Team Plumbing",
        status: "Pending",
        priority: "Medium",
      },
      {
        id: 4,
        date: "2025-02-27",
        task: "Inspect plumbing system in Building 2",
        assignedTo: "Team Plumbing",
        status: "In Progress",
        priority: "High",
      },
    ],
    electrical: [
      {
        id: 5,
        date: "2025-02-25",
        task: "Fix lights in Hall A",
        assignedTo: "Team Electrical",
        status: "In Progress",
        priority: "Medium",
      },
      {
        id: 6,
        date: "2025-02-25",
        task: "Replace light bulbs in Lobby",
        assignedTo: "Team Electrical",
        status: "Resolved",
        priority: "Low",
      },
      {
        id: 7,
        date: "2025-02-26",
        task: "Inspect electrical wiring in Office B",
        assignedTo: "Team Electrical",
        status: "Pending",
        priority: "High",
      },
      {
        id: 8,
        date: "2025-02-27",
        task: "Install new lighting in Conference Room",
        assignedTo: "Team Electrical",
        status: "In Progress",
        priority: "Medium",
      },
    ],
    maintenance: [
      {
        id: 9,
        date: "2025-02-25",
        task: "Repair HVAC in Office 5",
        assignedTo: "Team Maintenance",
        status: "In Progress",
        priority: "High",
      },
      {
        id: 10,
        date: "2025-02-25",
        task: "General maintenance in Hall C",
        assignedTo: "Team Maintenance",
        status: "Pending",
        priority: "Low",
      },
      {
        id: 11,
        date: "2025-02-26",
        task: "Check air conditioning in Building 1",
        assignedTo: "Team Maintenance",
        status: "In Progress",
        priority: "Medium",
      },
      {
        id: 12,
        date: "2025-02-27",
        task: "Inspect fire safety equipment",
        assignedTo: "Team Maintenance",
        status: "Resolved",
        priority: "High",
      },
    ],
    security: [
      {
        id: 13,
        date: "2025-02-25",
        task: "Monitor visitor access logs",
        assignedTo: "Team Security",
        status: "Pending",
        priority: "Medium",
      },
      {
        id: 14,
        date: "2025-02-25",
        task: "Review security camera feed",
        assignedTo: "Team Security",
        status: "electricalUrgent",
        priority: "High",
      },
      {
        id: 15,
        date: "2025-02-26",
        task: "Inspect building entrances for security breaches",
        assignedTo: "Team Security",
        status: "In Progress",
        priority: "High",
      },
      {
        id: 16,
        date: "2025-02-27",
        task: "Test alarm system functionality",
        assignedTo: "Team Security",
        status: "Pending",
        priority: "Medium",
      },
    ],
  });

  const [newTask, setNewTask] = useState({
    date: "",
    task: "",
    assignedTo: "",
    status: "Pending",
    priority: "Medium",
  });

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleAssignTask = () => {
    if (!newTask.date || !newTask.task) return;

    const updatedTasks = { ...taskData };
    updatedTasks[selectedTeam].push({
      id: Date.now(),
      ...newTask,
      assignedTo: `Team ${
        selectedTeam.charAt(0).toUpperCase() + selectedTeam.slice(1)
      }`,
    });
    setTaskData(updatedTasks);
    setShowAddTaskModal(false);
    setNewTask({
      date: "",
      task: "",
      assignedTo: "",
      status: "Pending",
      priority: "Medium",
    });
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = { ...taskData };
    updatedTasks[selectedTeam] = updatedTasks[selectedTeam].filter(
      (task) => task.id !== taskId
    );
    setTaskData(updatedTasks);
  };

  const exportToCSV = () => {
    const tasks = taskData[selectedTeam];
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Task,Assigned To,Status,Priority\n" +
      tasks.map(task => 
        `${task.date},${task.task},${task.assignedTo},${task.status},${task.priority}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedTeam}_tasks.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTasks = taskData[selectedTeam]
    .filter(task => {
      if (priorityFilter === "all") return true;
      return task.priority === priorityFilter;
    })
    .filter(task => {
      if (statusFilter === "all") return true;
      return task.status === statusFilter;
    })
    .filter(task =>
      task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status) => {
    return taskStatusColors[status] || "gray";
  };

  const getPriorityColor = (priority) => {
    return taskPriorityColors[priority] || "gray";
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`max-w-7xl mx-auto`}>
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {visitorsCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {card.name}
                </h3>
                <span className={`p-3 rounded-full text-white bg-${card.color}-500`}>
                  {card.icon}
                </span>
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="text-2xl font-bold mb-2">{card.count}</p>
                <p className={`text-sm flex items-center ${
                  card.trendUp ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.trendUp ? <FaChartLine className="mr-1" /> : <FaChartLine className="mr-1 transform rotate-180" />}
                  {card.trend} from last week
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tasks Section */}
       
       <ManagerAllTenants/>
      </div>

      {/* Add Task Modal */}
      
      <AnimatePresence>
        {showAddTaskModal && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`w-full max-w-lg transform overflow-hidden rounded-2xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Add New Task
                    </h3>
                    <button
                      onClick={() => setShowAddTaskModal(false)}
                      className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={newTask.date}
                        onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                        className={`w-full p-2.5 rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-100 border-gray-600' 
                            : 'bg-white text-gray-800 border-gray-300'
                        } border focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Task Description
                      </label>
                      <input
                        type="text"
                        value={newTask.task}
                        onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                        className={`w-full p-2.5 rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-100 border-gray-600' 
                            : 'bg-white text-gray-800 border-gray-300'
                        } border focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Status
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        className={`w-full p-2.5 rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-100 border-gray-600' 
                            : 'bg-white text-gray-800 border-gray-300'
                        } border focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="electricalUrgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className={`w-full p-2.5 rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-100 border-gray-600' 
                            : 'bg-white text-gray-800 border-gray-300'
                        } border focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </form>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskModal(false)}
                      className={`px-4 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAssignTask}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Task
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManagerDashboard;
