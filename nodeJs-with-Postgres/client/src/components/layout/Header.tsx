"use client";
import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Menu, X } from 'lucide-react';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-gradient-to-r fixed top-0 w-full from-indigo-500 to-purple-600 shadow-lg p-4 flex justify-between items-center">
      {/* Logo Area */}
      <div className="flex items-center">
        <div className="font-bold text-xl text-white tracking-wide">
          Social<span className="text-yellow-300">App</span>
        </div>
      </div>
      
      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Desktop Navigation */}
      <div className={`flex-grow items-center justify-end space-x-6 md:flex ${isMobileMenuOpen ? 'flex absolute top-16 left-0 right-0 flex-col bg-indigo-500 p-4 space-y-4 space-x-0 shadow-lg z-50' : 'hidden'}`}>
        {/* Search Bar */}
        <div className={`relative transition-all duration-200 ${isSearchFocused ? 'w-64' : 'w-48'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-indigo-300" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 rounded-full border border-indigo-400 bg-indigo-100 bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Notification and Message Icons */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell size={22} className="text-white cursor-pointer hover:text-yellow-300 transition-colors duration-200" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              3
            </div>
          </div>
          
          <div className="relative">
            <MessageSquare size={22} className="text-white cursor-pointer hover:text-yellow-300 transition-colors duration-200" />
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              5
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative group">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="relative overflow-hidden rounded-full border-2 border-indigo-300 p-0.5 transform transition-transform duration-300 hover:scale-110">
              <img
                src="/api/placeholder/40/40"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-indigo-500 rounded-full w-3 h-3"></div>
            </div>
            <span className="text-white text-sm hidden md:block">UserName</span>
          </div>
          
          {/* Dropdown Menu - Shows on hover */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 scale-95 transform origin-top-right transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 invisible group-hover:visible">
            <div className="py-1">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">Your Profile</a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">Settings</a>
              <a href="#logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;