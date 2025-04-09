import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { FaPersonBooth } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const VisitorManagement = () => {
  const visitors = [
    {
      name: "John Doe",
      office: "Marketing",
      checkIn: "10:00 AM",
      checkOut: "12:00 PM",
      qrScanned: true,
    },
    {
      name: "Jane Smith",
      office: "Finance",
      checkIn: "09:30 AM",
      checkOut: "",
      qrScanned: false,
    },
    {
      name: "Michael Scott",
      office: "Sales",
      checkIn: "11:00 AM",
      checkOut: "02:00 PM",
      qrScanned: true,
    },
  ];

  const upcomingVisits = [
    { name: "Pam Beesly", time: "02:30 PM", office: "HR", status: "pending" },
    {
      name: "Dwight Schrute",
      time: "03:00 PM",
      office: "Operations",
      status: "approved",
    },
  ];

  const visitorStats = {
    totalVisitors: 50,
    visitorsByOffice: { Marketing: 15, Sales: 10, Finance: 5, Operations: 10 },
    hourlyVisitors: [5, 10, 15, 20, 30, 35, 40, 50, 60, 70],
  };

  const chartData = {
    labels: [
      "8AM",
      "9AM",
      "10AM",
      "11AM",
      "12PM",
      "1PM",
      "2PM",
      "3PM",
      "4PM",
      "5PM",
    ],
    datasets: [
      {
        label: "Visitors Flow",
        data: visitorStats.hourlyVisitors,
        fill: false,
        borderColor: "#4C75B4",
        backgroundColor: "#4C75B4",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#4C75B4",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Visitor Flow Over the Day",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(0, 0, 0, 0.8)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          beginAtZero: true,
          font: {
            size: 12,
            weight: "bold",
          },
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#E8F9FF] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-semibold color-[#1A415A]">
            Visitor Management
          </h1>
        </div>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-medium mb-6 text-left">
            Visitor Overview
          </h2>
          <div className="h-[0.5px] w-full bg-slate-300 mb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visitors.map((visitor, index) => (
              <div
                key={index}
                className="bg-[#F9FAFB] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1A415A]">
                    {visitor.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      visitor.qrScanned ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {visitor.qrScanned ? "Scanned" : "Not Scanned"}
                  </span>
                </div>
                <div className="text-gray-700">
                  <p className="mb-2">
                    <strong>Office:</strong> {visitor.office}
                  </p>
                  <p className="mb-2">
                    <strong>Check-in:</strong> {visitor.checkIn}
                  </p>
                  <p>
                    <strong>Check-out:</strong> {visitor.checkOut || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-medium mb-4 text-left">
            Upcoming Visits
          </h2>
          <div className="h-[0.5px] w-full bg-slate-300 mb-2" />
          <div className="space-y-4">
            {upcomingVisits.map((visit, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg shadow-sm ${
                  visit.status === "approved" ? "bg-[#ADE0E6]" : "bg-[#F2C8C4]"
                }`}
              >
                <h3 className="text-lg font-semibold">{visit.name}</h3>
                <p>
                  <strong>Time:</strong> {visit.time}
                </p>
                <p>
                  <strong>Office:</strong> {visit.office}
                </p>
                <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-white ${
                      visit.status === "approved"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {visit.status === "approved" ? "Approve" : "Pending"}
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-red-500 text-white">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-medium mb-4 text-left">
            Visitor Statistics
          </h2>
          <div className="h-[0.5px] w-full bg-slate-300 mb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold">
                Total Visitors Today
              </h3>

              <div className="flex items-center mt-4">
                <FaPersonBooth className="text-4xl text-white p-2 bg-[#1A415A] mr-4 rounded-lg" />
                {/* <BsGraphUpArrow className="text-[#1A415A] text-xl" /> */}
                <p className="text-3xl sm:text-4xl text-[#1A415A] font-semibold">
                  {visitorStats.totalVisitors}
                </p>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-semibold">
                Visitors by Office
              </h3>
              <div className="space-y-2 mt-4">
                {Object.keys(visitorStats.visitorsByOffice).map((office) => (
                  <div key={office} className="flex justify-between">
                    <span className="text-gray-600">{office}</span>
                    <span className="text-blue-600">
                      {visitorStats.visitorsByOffice[office]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <h3 className="text-lg sm:text-xl font-semibold">
              Hourly Visitor Flow
            </h3>
            <div className="mt-4 h-64 sm:h-96">
              {" "}
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisitorManagement;
