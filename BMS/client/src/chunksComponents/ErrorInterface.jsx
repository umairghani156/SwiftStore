import { AiOutlineAlert } from "react-icons/ai";
import { FiRefreshCw } from 'react-icons/fi'; 
import { useTheme } from "../context/ThemeContext";
const ErrorInterface = ({ error, onRetry }) => {
    const { isDarkMode } = useTheme();
    console.log("error",error);
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col items-center`}>
        <div className="flex items-center justify-center mb-4">
          <AiOutlineAlert className="text-red-500 mr-2 flex-shrink-0" size={24} />
          <h3 className="text-red-700 text-lg font-medium">Unable to Load Data</h3>
        </div>
        
        <p className="text-red-600 mb-4 text-center">
          {error || "We couldn't retrieve the Data. Please try again."}
        </p>
        
        <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'}  rounded p-3 mb-4 text-sm text-red-800`}>
          <p className="font-medium mb-1">Possible solutions:</p>
          <ul className="list-disc pl-5">
            <li>Check your internet connection</li>
            <li>Refresh the page</li>
            <li>Try again in a few moments</li>
          </ul>
        </div>
        
        <button 
          onClick={onRetry}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <FiRefreshCw className="mr-2" size={18} />
          Retry Loading Data
        </button>
      </div>
    );
  };

  export default ErrorInterface;