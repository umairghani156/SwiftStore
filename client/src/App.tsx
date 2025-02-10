import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import { useSelector } from 'react-redux'

function App() {

  const {theme} = useSelector((state: any) => state.theme);

  return (
    <>
     <div className='min-h-screen bg-base-200 transition-colors duration-200' data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/product/:id' element={<ProductPage/>}/>
      </Routes>
     </div>
    </>
  )
}

export default App
