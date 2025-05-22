import { useEffect, useState } from 'react'

import './App.css'
import axios from 'axios';
import Navbar from './components/Navbar';

function App() {
  const [products, setProducts] = useState([]) as any
  const [showModel, setShowModel] = useState<boolean>(false)

  useEffect(() => {
    const getAllProducts = async () => {
      const res = await axios.get("https://fakestoreapi.com/products");
      if (res.status) {
        console.log(res.data)
        setProducts(res.data)
      }
    };
    getAllProducts()
  }, [])

  const handler = (id: number) => {
    console.log(id)

    const uniqueData = products.filter((val: any) => val.id !== id);
    console.log(uniqueData)

  }

  return (
    <div className='relative'>
      <div className='shadow-md'>
        <Navbar setShowModel={setShowModel} showModel={showModel}/>
      </div>
      <div className='container mx-auto mt-2'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2'>
          {products?.map((data: any) => (

            <div className='border border-gray-200 p-2' key={data.id}>
              <div className='w-full h-[300px]'>
                <img className='w-full h-full' src={data.image} alt="" />

              </div>
              <div className='border-t border-gray-200 py-2'>
                <h2 className='font-bold'>CLASSIC PEACE LILY</h2>
                <p>POPULAR HOUSE PLANT</p>
                <p>$18</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam vero molestiae, delectus ratione provident minima.</p>
                <div className='pt-2 flex justify-end gap-2'>
                  <button className='px-2 py-1 border border-gray-200 rounded bg-blue-400 text-white'
                    onClick={() => handler(data.id)}>ADD TO CART</button>
                  <button className='px-2 py-1 border border-gray-200 rounded bg-blue-400 text-white'>WISHLIST</button>
                </div>
              </div>
            </div>
          ))
          }

        </div>



      </div>
      { showModel &&
       ( <div className='fixed top-0 right-0 w-[200px] h-screen'>
        <div className='h-full bg-red-400 t-0'>
          <div className='flex justify-between items-center p-2'>
          <h1>Hello world</h1>
          <button className='border border-gray-500 px-2 px-1 rounded cursor-pointer transition duration-400'
          onClick={()=> setShowModel(false)}>X</button>
          </div>
        </div>
      </div>)}
    </div>
  )
}

export default App
