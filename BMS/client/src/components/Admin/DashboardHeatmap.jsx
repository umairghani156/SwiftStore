import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";
import { useDispatch, useSelector } from "react-redux";
import { getHourlyVisitorFlowThunk } from "../../store/thunks/visitor.thunk";
import { useTheme } from "../../context/ThemeContext";
import { FaSpinner } from "react-icons/fa";

// Function to get the days in the current month
function getDaysInMonth(month) {
  const daysInMonth = {
    Jan: 31,
    Feb: 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31,
  };
  return daysInMonth[month] || 30;
}

const DashboardHeatmap = () => {
  const dispatch = useDispatch();
  const { hourlyVisitors } = useSelector((state) => state.visitors);
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  // Light theme configuration
  const lightThemeOptions = {
    data: [],
    title: {
      text: "Visitor Density in Real-Time - " +
        new Date().toLocaleString("default", { month: "long" }),
      fontSize: 16,
      fontFamily: "'Inter', sans-serif",
      color: '#374151',
    },
    series: [
      {
        type: "heatmap",
        xKey: "day",
        xName: "Day",
        yKey: "month",
        yName: "Month",
        colorKey: "visitorDensity",
        colorName: "Visitor Density",
        colorRange: ["#43a2ca", "#a8ddb5", "#f0f9e8"],
        label: {
          enabled: true,
          color: '#374151',
        },
        tooltip: {
          enabled: true,
          renderer: (params) => {
            return {
              content: `${params.xName}: ${params.datum.day}
                       ${params.yName}: ${params.datum.month}
                       ${params.colorName}: ${params.datum.visitorDensity}`,
              color: '#374151',
              backgroundColor: '#ffffff',
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Days",
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          color: '#374151',
        },
        label: {
          rotation: 0,
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
          color: '#374151',
        },
        gridStyle: [{
          stroke: 'rgba(0, 0, 0, 0.1)',
        }],
      },
      {
        type: "category",
        position: "left",
        title: {
          text: "",
        },
        label: {
          rotation: 0,
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
          color: '#374151',
        },
        gridStyle: [{
          stroke: 'rgba(0, 0, 0, 0.1)',
        }],
      },
    ],
    background: {
      fill: '#ffffff',
    },
    legend: {
      enabled: true,
      position: 'right',
      spacing: 20,
      item: {
        paddingY: 16,
        marker: {
          shape: 'square',
          size: 15,
          padding: 8,
          strokeWidth: 0,
        },
        label: {
          color: '#374151',
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
        },
      },
    },
  };

  // Dark theme configuration
  const darkThemeOptions = {
    data: [],
    title: {
      text: "Visitor Density in Real-Time - " +
        new Date().toLocaleString("default", { month: "long" }),
      fontSize: 16,
      fontFamily: "'Inter', sans-serif",
      color: '#e5e7eb',
    },
    series: [
      {
        type: "heatmap",
        xKey: "day",
        xName: "Day",
        yKey: "month",
        yName: "Month",
        colorKey: "visitorDensity",
        colorName: "Visitor Density",
        colorRange: ['#0f172a', '#2563eb', '#60a5fa'],
        label: {
          enabled: true,
          color: '#e5e7eb',
        },
        tooltip: {
          enabled: true,
          renderer: (params) => {
            return {
              content: `${params.xName}: ${params.datum.day}
                       ${params.yName}: ${params.datum.month}
                       ${params.colorName}: ${params.datum.visitorDensity}`,
              color: '#e5e7eb',
              backgroundColor: '#1f2937',
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Days",
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          color: '#e5e7eb',
        },
        label: {
          rotation: 0,
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
          color: '#e5e7eb',
        },
        gridStyle: [{
          stroke: 'rgba(255, 255, 255, 0.1)',
          lineDash: [4, 2],
        }],
      },
      {
        type: "category",
        position: "left",
        title: {
          text: "",
        },
        label: {
          rotation: 0,
          fontSize: 12,
          fontFamily: "'Inter', sans-serif",
          color: '#e5e7eb',
        },
        gridStyle: [{
          stroke: 'rgba(255, 255, 255, 0.1)',
          lineDash: [4, 2],
        }],
      },
    ],
    background: {
      fill: '#111827',
    },
    legend: {
      enabled: true,
      position: 'right',
      spacing: 20,
      item: {
        paddingY: 16,
        marker: {
          shape: 'square',
          size: 15,
          padding: 8,
          strokeWidth: 0,
        },
        label: {
          color: '#e5e7eb',
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
        },
      },
    },
  };

  const [options, setOptions] = useState(isDarkMode ? darkThemeOptions : lightThemeOptions);

  // Fetching data for current month and updating options state
  function getDataForCurrentMonth() {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const daysInCurrentMonth = getDaysInMonth(month);
  
    // Check if hourlyVisitors data exists and map it correctly
    const visitorData = hourlyVisitors?.monthlyVisitors?.map((visitor, index) => ({
      year: currentDate.getFullYear(),
      month: month,
      day: index + 1,
      visitorDensity: visitor,
    })) || [];

    return visitorData.length ? visitorData : [];
  }

  useEffect(() => {
    setLoading(true);
    dispatch(getHourlyVisitorFlowThunk()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (hourlyVisitors?.monthlyVisitors) {
      const currentTheme = isDarkMode ? darkThemeOptions : lightThemeOptions;
      setOptions({
        ...currentTheme,
        data: getDataForCurrentMonth(),
      });
    }
  }, [hourlyVisitors, isDarkMode]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <FaSpinner className="animate-spin text-3xl mr-2" />
        <span>Loading heatmap...</span>
      </div>
    );
  }

  return (
    <div className={`chart-container h-full w-full rounded-lg overflow-hidden ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <AgCharts options={options} />
    </div>
  );
};

export default DashboardHeatmap;
