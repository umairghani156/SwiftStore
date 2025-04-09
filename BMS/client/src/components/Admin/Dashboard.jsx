import React, { use } from "react";
import { FaPersonBooth, FaBuilding } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineErrorOutline, MdEmergencyShare } from "react-icons/md";
import { Line, Bar, Pie } from "react-chartjs-2";
import DashboardHeatmap from "./DashboardHeatmap";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const {visitorsStatistics} = useSelector(state => state.visitors)
  const visitorTrendsData = [120, 200, 150, 300, 250, 400, 342];
  const buildingOccupancy = 65;

  const issues = [
    { id: 1, description: "Elevator out of service", status: "Ongoing" },
    { id: 2, description: "Wi-Fi connectivity issue", status: "Pending" },
    { id: 3, description: "Broken window in lobby", status: "Resolved" },
  ];

  const visitorTrendsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Visitor Trends (Last 7 Days)",
      },
    },
  };

  const visitorTrendsChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Visitors",
        data: visitorTrendsData,
        borderColor: "#66c0f8",
        backgroundColor: "#66c0f8",
        fill: false,
      },
    ],
  };

  const buildingOccupancyData = {
    labels: ["Occupied", "Available"],
    datasets: [
      {
        data: [buildingOccupancy, 100 - buildingOccupancy],
        backgroundColor: ["#66c0f8", "#e0e0e0"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="h-[100vh]">
      <div className="flex flex-col md:flex-col lg:flex-row justify-between bg-[#E8F9FF] p-8 gap-5 w-full">
        <div className="flex flex-col md:flex-row lg:flex-row w-full gap-5  h-auto">
          <div className="w-full h-full bg-[#ADE0E6] flex flex-col justify-center rounded-xl p-4 gap-5">
            <h1 className="text-[1.1rem] font-semibold text-[#1A415A]">
              Total Visitors Today
            </h1>
            <div className="flex flex-row items-center font-bold gap-2">
              <FaPersonBooth className="text-4xl text-white p-2 bg-[#1A415A] mr-4 rounded-lg" />
              <BsGraphUpArrow className="text-[#1A415A] text-xl" />
              <h2 className="text-[#1A415A] text-xl">10</h2>
            </div>
          </div>
          <div className="w-full h-full bg-[#F8E4C6] flex flex-col rounded-xl justify-center p-4 gap-5">
            <h1 className="text-[1.1rem] font-semibold text-[#1A415A]">
              Pending Issues
            </h1>
            <div className="flex flex-row items-center font-bold gap-2">
              <MdOutlineErrorOutline className="text-4xl text-white p-2 bg-[#1A415A] mr-4 rounded-lg" />
              <BsGraphUpArrow className="text-[#1A415A] text-xl" />
              <h2 className="text-[#1A415A] text-xl">10</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row w-full gap-5  h-[150px]">
          <div className="w-full h-full bg-[#F2C8C4] flex flex-col rounded-xl justify-center p-4 gap-5">
            <h2 className="text-[1.1rem] font-semibold text-[#1A415A]">
              Visitors in the Building
            </h2>
            <div className="flex flex-row items-center font-bold gap-2">
              <FaBuilding className="text-4xl text-white p-2 bg-[#1A415A] mr-4 rounded-lg" />
              <BsGraphUpArrow className="text-[#1A415A] text-xl" />
              <h2 className="text-[#1A415A] text-xl">10</h2>
            </div>
          </div>
          <div className="w-full h-full bg-[#66c0f8] flex flex-col rounded-xl justify-center p-4 gap-5">
            <h2 className="text-[1.1rem] font-semibold text-[#1A415A]">
              Emergency Alerts
            </h2>
            <div className="flex flex-row items-center font-bold gap-2">
              <MdEmergencyShare className="text-4xl text-white p-2 bg-[#1A415A] mr-4 rounded-lg" />
              <BsGraphUpArrow className="text-[#1A415A] text-xl" />
              <h2 className="text-[#1A415A] text-xl">20</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-4">
              Visitor Trends (Last 7 Days)
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <Line
                data={visitorTrendsChartData}
                options={visitorTrendsOptions}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-4">
              Building Occupancy
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <Pie data={buildingOccupancyData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-4">
              Visitor Heatmap
            </h3>
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-gray-900 w-full">
                <DashboardHeatmap />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-4">
              Live Feed of Issues
            </h3>
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <p className="text-gray-700">{issue.description}</p>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      issue.status === "Ongoing"
                        ? "bg-yellow-100 text-yellow-700"
                        : issue.status === "Pending"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
