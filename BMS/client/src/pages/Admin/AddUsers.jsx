import React, { memo, useState, useCallback, use, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaUserTag, FaImage, FaSpinner, FaLock, FaArrowLeft } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from "react-redux";
import { addUserThunk } from "../../store/thunks/auth.thunk";
import { getOfficeThunk } from "../../store/thunks/office.thunk";

const AddUserForm = () => {
  
  const dispatch = useDispatch();
  const {office} = useSelector((state) => state.office);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Admin",
    contactNumber: "",
    office: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!formData.office.trim()) newErrors.office = "Office is required";
    if (!formData.image) newErrors.image = "Profile image is required";
    return newErrors;
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
    setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        contactNumber: formData.contactNumber,
        office: formData.office,
        image: imagePreview || null,
      };
    dispatch(addUserThunk(newUser));
      setTimeout(() => {
        navigate('/admin-panel/all-users');
      }, 1500);
    } catch (error) {
      toast.error("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(()=>{
    function getOfficeName() {
      dispatch(getOfficeThunk());
    }
    getOfficeName();
  },[])


  return (
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin-panel/all-users')}
            className={`inline-flex items-center text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <FaArrowLeft className="mr-2" /> Back to All Users
          </button>
          <div className={`rounded-lg shadow-sm overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
            <div className={`px-6 py-4 ${isDarkMode
              ? 'bg-gradient-to-r from-blue-900 to-blue-800 border-b border-gray-700'
              : 'bg-gradient-to-r from-blue-600 to-blue-800'
              }`}>
              <h1 className="text-xl font-bold text-white">Add New User</h1>
              <p className="mt-1 text-sm text-gray-200">
                Fill in the information below to create a new user account
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6`}>
              {/* Username */}
              <div className="flex flex-col">
                <p className="text-sm font-medium mb-1">Username {errors.username && <span className="text-red-500">*</span>}</p>
                <div className={`flex border px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-50'}`}>
                  <label className={`pr-1 flex justify-center items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaUser className="text-xl w-full" size={16} />
                    </label>
                  <input type="text"
                      value={formData.username}
                    onChange={(e)=> setFormData({...formData, username: e.target.value})}
                    placeholder="Enter username" className={`w-full ml-1 ${isDarkMode ? 'bg-gray-700 text-gray-100 outline-none' : ' text-gray-900 outline-none'}`} />
                </div>
                {errors.username && <p className="text-red-500">{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <p className="text-sm font-medium mb-1">Email {errors.email && <span className="text-red-500">*</span>}</p>
                <div className={`flex border px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-50'}`}>
                  <label className={`pr-1 flex justify-center items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaEnvelope className="text-xl w-full" size={16} />
                  </label>
                  <input type="email"
                  value={formData.email}
                    onChange={(e)=> setFormData({...formData, email: e.target.value})}
                    placeholder="Enter Email" className={`w-full ml-1 ${isDarkMode ? 'bg-gray-700 text-gray-100 outline-none' : ' text-gray-900 outline-none'}`} />
                </div>
                {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>

              {/* Password */}
              <div className="flex flex-col">
                <p className="text-sm font-medium mb-1">Password {errors.password && <span className="text-red-500">*</span>}</p>
                <div className={`flex border px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-50'}`}>
                  <label className={`pr-1 flex justify-center items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaLock className="text-xl w-full" size={16} />
                  </label>
                  <input type="password"
                  value={formData.password}
                    onChange={(e)=> setFormData({...formData, password: e.target.value})}
                    placeholder="Enter Password" className={`w-full ml-1 ${isDarkMode ? 'bg-gray-700 text-gray-100 outline-none' : ' text-gray-900 outline-none'}`} />
                </div>
                {errors.password && (
                  <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Please enter a password
                  </p>
                )}
                
              </div>


              <div className="space-y-1">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Role {errors.role && <span className="text-red-500">*</span>}
                    </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTag className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} `} />
                  </div>
                  <select name="role" id="role"
                  value={formData.role}
                    onChange={(e)=> setFormData({...formData, role: e.target.value})}
                    className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                      }`}>
                    <option value="Admin">Admin</option>
                    <option value="Tenant">Tenat</option>
                    <option value="Manager">Manager</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium mb-1">Contact Number {errors.contactNumber && <span className="text-red-500">*</span>}</p>
                <div className={`flex border px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-50'}`}>
                  <label className={`pr-1 flex justify-center items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaPhone className="text-xl w-full" size={16} />
                    </label>
                  <input type="number"
                      value={formData.contactNumber}
                    min={0}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="Enter Contact Number" className={`w-full ml-1 ${isDarkMode ? 'bg-gray-700 text-gray-100 outline-none' : ' text-gray-900 outline-none'}`} />
                </div>
                {errors.contactNumber && (
                  <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Please enter a valid contact number
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Office {errors.office && <span className="text-red-500">*</span>}
                    </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} `} />
                  </div>
                  <select
                    value={formData.office}
                    id="office"
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })} name="office"
                    className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
                      }`}>
                   {
                    office && office.map((office) => (
                     
                      <option key={office._id} value={office._id}>{office.officeName} <span className="text-red-600">{office.isOccupied === false && "new"}</span></option>
                    ))
                   }
                  </select>
                </div>
                {
                  errors.office && (
                    <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Please select an office
                    </p>
                  )
                }

              </div>











            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                Profile Image {errors.image && <span className="text-red-500">*</span>}
                    </label>
              <div className="flex items-center space-x-6">
                <div className={`flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <FaImage className={`h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                  </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className={`relative cursor-pointer rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                    }`}>
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {errors.image && (
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`}>{errors.image}</p>
                  )}
                </div>
                </div>
              </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
                <button
                  type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium shadow-sm transition-all duration-200 ${isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Adding User...
                  </span>
                ) : (
                  'Add User'
                )}
                </button>
              </div>
            </form>
          </div>
        </div>
     
      </div>
  );
};

export default AddUserForm;