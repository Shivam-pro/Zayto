import React from 'react'
import './sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar-container'>
      <NavLink to='/add' className="sidebars">
        <div className='sidebar-image'>
          <img src={assets.addIcon} alt="" />
        </div>
        <p>Add Items</p>
      </NavLink>
      <NavLink to='/list' className="sidebars">
        <div className='sidebar-image'>
          <img src={assets.listItems} alt="" />
        </div>
        <p>List Items</p>
      </NavLink>
      <NavLink to='/orders' className="sidebars">
        <div className='sidebar-image'>
          <img src={assets.orders} alt="" />
        </div>
        <p>Orders</p>
      </NavLink>
    </div>
  )
}

export default Sidebar
