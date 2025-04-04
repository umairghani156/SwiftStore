import React from 'react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4 bg-gray-800 text-white'>
      <div className='text-2xl font-bold'>MyApp</div>
      <nav className='space-x-4'>
        <a href='#' className='hover:text-gray-300'>Home</a>
        <a href='#' className='hover:text-gray-300'>About</a>
        <a href='#' className='hover:text-gray-300'>Contact</a>
      </nav>
      <button className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700'>Login</button>

    </div>
  )
}

export default Navbar