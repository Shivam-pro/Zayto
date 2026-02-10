import React, { useState } from 'react'
import './exploremenu.css'
import { menu_list } from '../../Assets/assets'

const Exploremenu = ({setCategory, category}) => {
    return (
        <div className='exploremenu' id='exploremenu'>
            <h1>Explore our menu</h1>
            <p>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meat at a time.</p>
            <div className="menu-items-list">
                {menu_list.map((item, index) => {
                    return (
                        <div className='menu-item' key={index}>
                            <div className={category == item.menu_name? "menu-image selected": "menu-image"}>
                                <img src={item.menu_image} alt="" onClick={()=>{setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}}/>
                            </div>
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Exploremenu
