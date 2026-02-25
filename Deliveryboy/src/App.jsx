import { useEffect, useState } from 'react';
import './App.css'
import Navbar from "./component/navbar/Navbar.jsx";
import Login from './component/login/Login.jsx';
import Home from './component/home/Home.jsx';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, useNavigate } from 'react-router-dom'
import AllOrders from './component/allOrders/AllOrders.jsx';
import TrackOrder from './component/trackOrder/TrackOrder.jsx';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("deliveryuser")));
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(true);
  const url = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const nevigate = useNavigate();

  useEffect(() => {
    if (token) {
      nevigate('/home');
    }
  }, [])

  return (
    <div className='app'>
      <Navbar token={token} setToken={setToken} setUser={setUser} setLongitude={setLongitude} setLatitude={setLatitude} />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login url={url} setToken={setToken} setUser={setUser} />} />
        <Route path='/home' element={<Home user={user} locationAllowed={locationAllowed} url={url}/>} />
        <Route path='/allorders' element={<AllOrders url={url} user={user} />} />
        <Route path='/trackorder' element={<TrackOrder url={url} user={user} longitude={longitude} latitude={latitude} setLatitude={setLatitude} setLongitude={setLongitude} />} />
      </Routes>
    </div>
  )
}

export default App