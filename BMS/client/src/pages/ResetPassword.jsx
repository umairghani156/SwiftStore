import React, { useState } from 'react';
import { changePasswordAPI } from '../api/authApi';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const userInfo = location.pathname;
      const data = {password: formData.password, url: userInfo};
      
      const res = await changePasswordAPI(data);
      console.log("data", res);
      if(!res.success) return toast.error(res?.response?.data.message || "Something went wrong");
      setTimeout(() => {
        setIsSubmitting(false);
        setResetSuccess(true);
      }, 1000);
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Weak';
      case 1: return 'Fair';
      case 2: return 'Good';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Weak';
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  if (resetSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
            <Link
              to="/login" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>
        <p className="text-gray-600 mb-6 text-center">Please enter your new password below.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Password Strength:</span>
                  <span className="text-sm font-medium" style={{ color: passwordStrength >= 3 ? '#10B981' : passwordStrength >= 2 ? '#FBBF24' : '#EF4444' }}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()}`} 
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <ul className="mt-2 text-xs text-gray-600 space-y-1">
                  <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                    ✓ At least 8 characters
                  </li>
                  <li className={formData.password.match(/[A-Z]/) ? "text-green-500" : ""}>
                    ✓ At least one uppercase letter
                  </li>
                  <li className={formData.password.match(/[0-9]/) ? "text-green-500" : ""}>
                    ✓ At least one number
                  </li>
                  <li className={formData.password.match(/[^A-Za-z0-9]/) ? "text-green-500" : ""}>
                    ✓ At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Confirm your new password"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
          
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <a href="/login" className="text-sm text-blue-600 hover:text-blue-800">
          Return to Login
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;