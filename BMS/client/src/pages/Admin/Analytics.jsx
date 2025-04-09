import React, { useEffect } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorAnalyticsThunk } from "../../store/thunks/visitor.thunk";
import { useTheme } from '../../context/ThemeContext';
import ErrorInterface from "../../chunksComponents/ErrorInterface";


const Analytics = () => {
  const dispatch = useDispatch();
  const { visitorsAnalytics, loading, error } = useSelector((state) => state.visitors);
  const [data, setData] = React.useState([]);
  const { isDarkMode } = useTheme();



  const weeklyData = {
    year: data?.weeklyAnalytics?._id.year,
    week: data?.weeklyAnalytics?._id.week,
    totalVisits: data?.weeklyAnalytics?.totalVisits,
  };

  const monthlyData = {
    year: data?.monthlyAnalytics?._id.year,
    month: data?.monthlyAnalytics?._id.month,
    totalVisits: 5,
  };
  useEffect(() => {
   async function fetchData() {
     const data = await dispatch(getVisitorAnalyticsThunk());
     setData(data.payload);
    }
    fetchData();
  }, [dispatch]);


  const dailyChartData = {
    labels: [data?.dailyAnalytics?._id],
    datasets: [
      {
        label: "Daily Visits",
        data: [data?.dailyAnalytics?.count || 0],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const weeklyChartData = {
    labels: ["Week"],
    datasets: [
      {
        label: "Weekly Visits",
        data: [data?.weeklyAnalytics?.totalVisits],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  const monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthlyChartData = {
    labels: [monthsName[data?.monthlyAnalytics?._id.month - 1]],
    datasets: [
      {
        label: "Monthly Visits",
        data: [data?.monthlyAnalytics?.totalVisits],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: data?.statusAnalytics?.map((item) => item._id),
    datasets: [
      {
        data: data?.statusAnalytics?.map((item) => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: true,
        font: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600'
        },
        color: isDarkMode ? '#e5e7eb' : '#374151'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      }
    }
  };

 

  return (
    <>
    {
      loading && (
        <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
      )
    }
    {
      error && (
        <ErrorInterface error={error} onRetry={() => dispatch(getVisitorAnalyticsThunk())} />
      )
    }
   { 
     !loading && !error &&
     (<div className="w-full h-full">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <h1 className={`text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-full">
          {/* Daily Analytics */}
          <div className={`w-full shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 ${isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
            }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Daily Analytics
            </h2>
            <div className="w-full h-48 sm:h-64">
              <Line data={dailyChartData} options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    display: window.innerWidth >= 640,
                    labels: {
                      ...chartOptions.plugins.legend.labels,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12,
                        family: "'Inter', sans-serif"
                      },
                      boxWidth: window.innerWidth < 640 ? 30 : 40,
                      padding: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                }
              }} />
            </div>
          </div>

          {/* Weekly Analytics */}
          <div className={`w-full shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 ${isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
            }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Weekly Analytics
            </h2>
            <div className="w-full h-48 sm:h-64">
              <Bar data={weeklyChartData} options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    display: window.innerWidth >= 640,
                    labels: {
                      ...chartOptions.plugins.legend.labels,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12,
                        family: "'Inter', sans-serif"
                      },
                      boxWidth: window.innerWidth < 640 ? 30 : 40,
                      padding: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                }
              }} />
            </div>
            <div className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>{`Week ${weeklyData.week}, ${weeklyData.year}`}</div>
          </div>

          {/* Monthly Analytics */}
          <div className={`w-full shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 ${isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
            }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Monthly Analytics
            </h2>
            <div className="w-full h-48 sm:h-64">
              <Bar data={monthlyChartData} options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    display: window.innerWidth >= 640,
                    labels: {
                      ...chartOptions.plugins.legend.labels,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12,
                        family: "'Inter', sans-serif"
                      },
                      boxWidth: window.innerWidth < 640 ? 30 : 40,
                      padding: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                }
              }} />
            </div>
            <div className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>{`Month ${monthlyData.month}, ${monthlyData.year}`}</div>
          </div>

          {/* Status Analytics */}
          <div className={`w-full shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 ${isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-100'
            }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Status Analytics
            </h2>
            <div className="w-full h-48 sm:h-64 flex items-center justify-center">
              <div className="w-full max-w-[180px] sm:max-w-[280px]">
                <Pie data={{
                  ...statusChartData,
                  datasets: [{
                    ...statusChartData.datasets[0],
                    backgroundColor: isDarkMode
                      ? ["#ef4444", "#3b82f6", "#f59e0b"]
                      : ["#dc2626", "#2563eb", "#d97706"],
                  }]
                }} options={{
                  ...chartOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: window.innerWidth < 640 ? 'bottom' : 'right',
                      labels: {
                        ...chartOptions.plugins.legend.labels,
                        font: {
                          size: window.innerWidth < 640 ? 10 : 12,
                          family: "'Inter', sans-serif"
                        },
                        boxWidth: window.innerWidth < 640 ? 12 : 16,
                        padding: window.innerWidth < 640 ? 6 : 12
                      }
                    }
                  }
                }} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {visitorsAnalytics?.statusAnalytics?.map((status, index) => (
                <div key={status._id} className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                  <div className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {status._id}
                  </div>
                  <div className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                    {status.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default Analytics;
