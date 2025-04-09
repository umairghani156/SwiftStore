import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { addVisitorThunk } from '../../store/thunks/visitor.thunk';
import { Toaster } from 'react-hot-toast';
import { FaUserPlus, FaIdCard, FaPhone, FaBuilding, FaClock, FaClipboardList } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { getOfficeThunk } from '../../store/thunks/office.thunk';
import ErrorInterface from '../../chunksComponents/ErrorInterface';

const AddVisitor = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const {office, loading, error} = useSelector((state) => state.office);
    const offices = [
        {
            id: 1,
            name: "Office 1",
            capacity: 10
        }
    ]
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        name: "",
        cnicNumber: "",
        contact: "",
        office: "",
        purpose: "",
        duration: ""
    });

    const addVisitorHanlder = async (e) => {
        e.preventDefault();
        const data = {
           ...formData,
            duration: Number(formData.duration)
        }
        console.log("Form", data);
        
         await dispatch(addVisitorThunk(data));

        setFormData({
            name: "",
            cnicNumber: "",
            contact: "",
            office: "",
            purpose: "",
            duration: ""
        });
    };

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Enter') {
                addVisitorHanlder(event);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    },[]);

    useEffect(() => {
        function getBackendDatas() {
            dispatch(getOfficeThunk());
        }
        getBackendDatas();
    },[])

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
                <ErrorInterface error={error} onRetry={() => dispatch(getOfficeThunk())} />
            )
        }
       { !loading && !error &&
       ( <>
        <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>Add New Visitor</h1>
                    <p className={`mt-2 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Enter visitor details to register them in the system</p>
            </div>

                {/* Form Card */}
                <div className={`rounded-lg shadow-md overflow-hidden ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                }`}>
                    <div className="p-6 sm:p-8">
                        <form className="space-y-6" onSubmit={addVisitorHanlder}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Name Field */}
                                <div>
                                    <label className={` text-sm font-medium mb-2 flex items-center ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        <FaUserPlus className={`mr-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        Visitor Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter full name"
                                    />
                    </div>

                                {/* CNIC Field */}
                                <div>
                                    <label className={`text-sm font-medium mb-2 flex items-center ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        <FaIdCard className={`mr-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        CNIC Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cnicNumber}
                                        onChange={(e) => setFormData({ ...formData, cnicNumber: e.target.value })}
                                        required
                                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter CNIC number"
                                    />
                    </div>

                                {/* Contact Field */}
                                <div>
                                    <label className={` text-sm font-medium mb-2 flex items-center ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        <FaPhone className={`mr-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        required
                                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter contact number"
                                    />
                    </div>

                                {/* Office Field */}
                                <div>
                                    <label className={` text-sm font-medium mb-2 flex items-center ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        <FaBuilding className={`mr-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        Office
                                    </label>
                                    <select name="office" id="" className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 text-gray-900'
                                        }`}
                                        value={formData.office}
                                        onChange={(e) => setFormData({ ...formData, office: e.target.value })}>
                                        <option value="" aria-readonly="true">Select Office</option>
                                        {office && office.map((office) => (
                                            <option key={office?._id} value={office?._id} className={` text-sm font-medium mb-2 flex items-center ${
                                                isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                                {office.officeName}
                                            </option>
                                        ))}
                                    </select>
                    </div>

                                {/* Duration Field */}
                                <div>
                                    <label className={` text-sm font-medium mb-2 flex items-center ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        <FaClock className={`mr-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        Visit Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                                                : 'border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter duration in minutes"
                                    />
                    </div>

                                {/* Purpose Field */}
                                <div>
                                    <label className={` text-sm font-medium mb-2 flex items-center ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        <FaClipboardList className={`mr-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        Purpose of Visit
                                    </label>
                                    <select
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        required
                                        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                    >
                                        <option value="" className={isDarkMode ? 'bg-gray-700' : ''}>Select purpose</option>
                                        <option value="Meeting" className={isDarkMode ? 'bg-gray-700' : ''}>Meeting</option>
                                        <option value="Delivery" className={isDarkMode ? 'bg-gray-700' : ''}>Delivery</option>
                                        <option value="Other" className={isDarkMode ? 'bg-gray-700' : ''}>Other</option>
                        </select>
                    </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    className={`px-6 py-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 flex items-center ${
                                        isDarkMode 
                                            ? 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800' 
                                            : 'bg-[#1A415A] hover:bg-[#2A516A] focus:ring-blue-500'
                                    }`}
                                >
                                    <FaUserPlus className="mr-2" />
                                    Add Visitor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>)}
        </>
    )
}

export default AddVisitor