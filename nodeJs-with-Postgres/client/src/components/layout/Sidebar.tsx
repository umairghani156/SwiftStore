'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, User, Settings, LogOut, Users, Bell, Bookmark, 
  MessageSquare, Compass, TrendingUp, Calendar, HeartPulse, 
  LayoutDashboard, ChevronLeft, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare, notification: 5 },
    { id: 'notifications', label: 'Notifications', icon: Bell, notification: 3 },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'health', label: 'Wellness', icon: HeartPulse },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <div 
      className={`flex flex-col bg-gradient-to-b from-indigo-900 to-purple-900 text-white h-full transition-all duration-300 ${
        expanded ? 'w-64' : 'w-20'
      } shadow-xl relative`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-20 bg-indigo-600 text-white p-1 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-10"
      >
        {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Header / Logo - Fixed at top */}
     

      {/* Scrollable Menu Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
        {/* Menu Items */}
        <nav className="space-y-1 px-3 mt-2 pb-4">
          {menuItems.map((item) => (
            <Link 
              href={`/${item.id === 'home' ? '' : item.id}`} 
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`
                flex items-center px-3 py-3 rounded-lg transition-all duration-200
                ${activeItem === item.id 
                  ? 'bg-indigo-700 text-white shadow-md' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }
                ${expanded ? '' : 'justify-center'}
              `}
            >
              <div className="relative">
                <item.icon size={20} className={activeItem === item.id ? 'text-white' : ''} />
                
                {/* Notification Badge */}
                {item.notification && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.notification}
                  </div>
                )}
              </div>
              
              {expanded && (
                <span className="ml-3 whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile Section - Fixed at bottom */}
      <div className="p-4 border-t border-indigo-800 sticky bottom-0 bg-gradient-to-t from-indigo-900 to-indigo-900 z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <User size={20} />
          </div>
          {expanded && (
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-indigo-300">@johndoe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;