import { useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import Add from './pages/add/Add'
import List from './pages/list/List'
import Orders from './pages/orders/Orders'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
function App() {
  const notify = () => toast("Wow so easy!");
  const url = import.meta.env.VITE_BACKEND_URL;
  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className='app-container'>
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add url={url}/>} />
          <Route path='/list' element={<List url={url}/>} />
          <Route path='/orders' element={<Orders url={url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
