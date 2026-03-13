import React, { useContext } from 'react'
import { Storecontext } from '../../context/Storecontext';

const Fooditem = ({ id, image, name, description, price, rating }) => {
    const {cartItems, addToCart, removeFromCart, url} = useContext(Storecontext);
    const ratingStar = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++){
            if(rating.average >= i+1){
                stars.push(<i key={i} className="fa-solid fa-star"></i>);
            }
            else if(rating.average >= i+0.5){
                stars.push(<i key={i} className="fa-solid fa-star-half"></i>);
            }
            else{
                stars.push(<i key={i} className="fa-regular fa-star"></i>);
            }
        }
        return stars;
    }
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
                <div className='rating-stars'>{ratingStar(rating)} <span>{`(${rating.count})`}</span></div>
                <h3>{name}</h3>
                <p>{description}</p>
                <p className='price'>₹{price}</p>
            </div>
        </div>
    )
}

export default Fooditem;