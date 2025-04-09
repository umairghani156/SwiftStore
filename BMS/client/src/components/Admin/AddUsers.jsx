import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaUserTag, FaImage, FaSpinner } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const AddUserForm = () => {
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
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!formData.office.trim()) newErrors.office = "Office is required";
    if (!formData.image) newErrors.image = "Profile image is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("User added successfully!");
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "Admin",
        contactNumber: "",
        office: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-xl bg-white border-0">
          <div className="rounded-t bg-gradient-to-r from-[#1A415A] to-indigo-500 mb-0 px-6 py-6">
            <div className="text-center flex justify-between items-center">
              <h6 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                Add New User
              </h6>
              {loading && (
                <FaSpinner className="animate-spin text-white text-xl" />
              )}
            </div>
          </div>

          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg mt-8">
                <h6 className="text-gray-600 text-sm font-semibold mb-4">
                  User Information
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.contactNumber && (
                      <p className="mt-1 text-xs text-red-500">{errors.contactNumber}</p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="office"
                      name="office"
                      value={formData.office}
                      onChange={handleChange}
                      placeholder="Office"
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.office ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.office && (
                      <p className="mt-1 text-xs text-red-500">{errors.office}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h6 className="text-gray-600 text-sm font-semibold mb-4">
                  Additional Information
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserTag className="text-gray-400" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">Tenant</option>
                      <option value="Manager">Office Manager</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  <div className="relative">
                    <div className="flex items-center space-x-4">
                      {imagePreview && (
                        <div className="relative w-20 h-20">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, image: null });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                          <FaImage className="text-gray-400 text-2xl mb-2" />
                          <span className="text-sm text-gray-500">Upload Profile Image</span>
                          <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                        {errors.image && (
                          <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-gradient-to-r from-[#1A415A] to-indigo-500 text-white rounded-lg 
                    ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#1A415A] hover:to-indigo-600'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200
                    flex items-center space-x-2`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Adding User...</span>
                    </>
                  ) : (
                    <span>Add User</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default AddUserForm;
