import React from 'react'
import { useTheme } from '../../context/ThemeContext';

const Pagination = ({totalPages, currentPage,onPageChange, setPage, page}) => {
    const {isDarkMode} = useTheme();
    console.log("totalPages",totalPages);
    console.log("currentPage",currentPage);
  return (
    <div className='flex gap-2 items-center justify-between'>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} 
        className={`py-2 px-4 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Prev</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() =>onPageChange({...page, currentPage: page.currentPage - 1})} 
        className={`${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} py-2 px-4 rounded-lg`}>Next</button>
    </div>
  )
}

export default Pagination