import React from 'react'
import VisitorManagement from '../../components/Admin/VisitorManagement'
import { useTheme } from '../../context/ThemeContext'

const AllVisitors = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <VisitorManagement/>
    </div>
  )
}

export default AllVisitors