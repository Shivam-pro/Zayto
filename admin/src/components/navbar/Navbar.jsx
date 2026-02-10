import React from 'react'
import { assets } from '../../assets/assets'
import './navbar.css'
const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='logo-container'>
        <div className='image'>
          <img src={assets.logo} alt="" />
        </div>
        <p>Admin panel</p>
      </div>
      <div className="profile-image">
        <div className='image'>
          <img src={assets.profile} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
