import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FaQrcode, FaUserCheck, FaTimesCircle, FaRedo, FaCamera, FaStopCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { checkInVisitorThunk } from "../../store/thunks/visitor.thunk";
import { useDispatch } from "react-redux";

const VisitorVerificationPage = () => {
  const { isDarkMode } = useTheme();
  const [scannedData, setScannedData] = useState(null);
  const [visitorDetails, setVisitorDetails] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const scannerRef = useRef(null); 
  const html5QrCode = useRef(null);
  const dispatch = useDispatch();

 

  const handleScan =async (decodedText, decodedResult) => {
    console.log("3. Decoded Text:", decodedText);
    if (!decodedText || decodedText === scannedData) {
      console.log("Same QR code scanned again");
    };

   
    setScannedData(decodedText);
    setScanError(null);

    try {
     
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
        
      } catch (parseError) {
       
        qrData = { qrCodeData: decodedText };
      }

      console.log("4. Looking for visitor with data:", {
        qrCodeData: qrData.qrCodeData,
        name: qrData.name,
        cnic: qrData.cnic
      });

      //TODO: Check if the visitor exists in the database


      const data = {
        id: qrData.qrCodeData,
        check_in: new Date().toISOString(),
      }
    const foundVisitor = await dispatch(checkInVisitorThunk(data));
    
    if (foundVisitor) {
       
      setVisitorDetails(foundVisitor.payload); 
      setIsVerified(true); 
      stopScanning();
    } else {
       
        setVisitorDetails(null);
        setIsVerified(false);
        setScanError("Invalid QR Code: Visitor not found");
      }
    } catch (error) {
      
      setScanError("Invalid QR Code format");
    }
  };

  const handleError = (err) => {
    if (err?.message && !err.message.includes("NotFoundException")) {
    console.error("QR Scan Error:", err);
      setScanError("Failed to access camera. Please check permissions.");
    }
  };

  const initializeScanner = () => {
    if (!html5QrCode.current) {
      console.log("Initializing scanner...");
      html5QrCode.current = new Html5Qrcode("qr-reader");
    }
  };

  const cleanupScanner = async () => {
    try {
      if (html5QrCode.current) {
        if (html5QrCode.current.isScanning) {
          await html5QrCode.current.stop();
        }
        console.log("Cleaning up scanner...");
        html5QrCode.current.clear();
        html5QrCode.current = null;
      }
    } catch (error) {
      console.error("Error cleaning up scanner:", error);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        await html5QrCode.current.stop();
      }
    } catch (error) {
      console.error("Error stopping scanner:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const startScanning = async () => {
    try {
      console
      initializeScanner();
      
      if (!html5QrCode.current) {
        throw new Error("Failed to initialize scanner");
      }

      setIsScanning(true);
      setScanError(null);
      setScannedData(null);
      setVisitorDetails(null);
      setIsVerified(false);

      await html5QrCode.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false
        },
        handleScan,
        handleError
      );
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setScanError("Failed to start the scanner. Please try again.");
      setIsScanning(false);
      await cleanupScanner();
    }
  };

  const resetScan = async () => {
    try {
      await stopScanning();
      await cleanupScanner();
    setScannedData(null);
    setVisitorDetails(null);
    setIsVerified(false);
      setScanError(null);
      await startScanning();
    } catch (err) {
      console.error("Error resetting scan:", err);
      setScanError("Failed to reset scanner. Please refresh the page.");
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupScanner().catch(console.error);
    };
  }, []);

  const StatusBadge = ({ isVerified }) => (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
        isVerified
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }`}
    >
      {isVerified ? (
        <>
          <FaUserCheck className="text-green-600 dark:text-green-400" />
          <span>Verified</span>
        </>
      ) : (
        <>
          <FaTimesCircle className="text-red-600 dark:text-red-400" />
          <span>Not Verified</span>
        </>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Visitor Verification
      </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Scan visitor QR codes to verify their identity and access permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                {!isScanning ? (
        <button
          onClick={startScanning}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white font-medium`}
                  >
                    <FaCamera className="text-lg" />
                    Start Scanning
        </button>
                ) : (
        <button
          onClick={stopScanning}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white font-medium`}
                  >
                    <FaStopCircle className="text-lg" />
                    Stop Scanning
        </button>
                )}
      </div>

      <div
                id="qr-reader"
                className={`w-full max-w-md aspect-square rounded-lg overflow-hidden ${
                  isScanning ? 'block' : 'hidden'
                } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              />

              {scanError && (
                <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                  {scanError}
                </div>
              )}
            </div>
          </div>

          {/* Visitor Details Section */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            {scannedData && visitorDetails ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Visitor Details
                  </h2>
                  <StatusBadge isVerified={isVerified} />
      </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                    <p className="font-medium mt-1">{visitorDetails.name}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CNIC</p>
                    <p className="font-medium mt-1">{visitorDetails.cnicNumber}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Purpose</p>
                    <p className="font-medium mt-1">{visitorDetails.purpose}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Host</p>
                    <p className="font-medium mt-1">{visitorDetails.host ?? 'Unknown'}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                    <p className="font-medium mt-1">{visitorDetails.duration}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Destination</p>
                    <p className="font-medium mt-1">{visitorDetails.office.officeName ?? 'Unknown'}</p>
                  </div>
                </div>

                <button
                  onClick={resetScan}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <FaRedo />
                  Scan Another QR Code
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <FaQrcode className={`text-6xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No Visitor Scanned
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Scan a visitor's QR code to view their details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorVerificationPage;