import React, { useContext } from 'react'
import { Storecontext } from '../../context/Storecontext';

const Fooditem = ({ id, image, name, description, price }) => {
    const {cartItems, addToCart, removeFromCart, url} = useContext(Storecontext)
    return (
        <div className='food-item-container'>
            <div className='food-item-image'>
                <img src={url+"/images/"+image} alt="" />
                {!cartItems[id] ?
                    <div className='add-items' onClick={()=>addToCart(id)}>
                        <i className="fa-solid fa-plus"></i>
                    </div> :
                    <div className='display-count'>
                        <div className='minus-btn' onClick={()=>removeFromCart(id)}><i className="fa-solid fa-minus"></i></div>
                        <p>{cartItems[id]}</p>
                        <div className='pluse-btn' onClick={()=>addToCart(id)}><i className="fa-solid fa-plus"></i></div>
                    </div>
                }
            </div>
            <div className='food-item-info'>
                <h3>{name}</h3>
                <p>{description}</p>
                <p className='price'>₹{price}</p>
            </div>
        </div>
    )
}

export default Fooditem;