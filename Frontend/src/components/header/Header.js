import React from 'react'
import './header.css'

const Hearder = () => {
  return (
    <div className='header'>
      <div className="header-content">
        <div className="header-top">
          <h1>Order your</h1>
          <h1>favourite food here</h1>
        </div>
        <div className="header-middle">
          <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise, Our mission is to satisfy your cravings and elevate your dining experience, one delicious meat at a time.</p>
        </div>
        <button className='header-btn'>View Menu</button>
      </div>
    </div>
  )
}

export default Hearder
