import React, { useContext } from 'react'
import './Cart.css'
import { Storecontext } from '../../context/Storecontext'
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount, url, food_list } = useContext(Storecontext);
  const navigate = useNavigate();
  return (
    <>
      <div className='cart'>
        <div className="cart-column">
          <div className='cart-item-column'>Items</div>
          <div className="title-column">Title</div>
          <div className="price-column">Price</div>
          <div className='quantity-column'>Quantity</div>
          <div className="total-column">Total</div>
          <div className="remove-column">Remove</div>
        </div>
        {food_list.map((items, index) => {
          if (cartItems[items._id] > 0) {
            return (
              <div className='cart-column' key={index}>
                <div className='cart-product-image'>
                  <img src={url + "/images/" + items.image} alt="" />
                </div>
                <div className="title">{items.name}</div>
                <div className="product-price">₹{items.price}</div>
                <div className='quantity'>{cartItems[items._id]}</div>
                <div className="total">₹{(items.price) * (cartItems[items._id])}</div>
                <div className="remove" onClick={() => removeFromCart(items._id)}><i className="fa-solid fa-xmark"></i></div>
              </div>
            )
          }
        }
        )}
      </div>
      <div className='cart-totals-container'>
        <div className="cart-totals-div">
          <h2>Cart Totals</h2>
          <div className="cart-total-elements">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-elements">
            <p>Delivery Fee</p>
            <p>₹{0}</p>
          </div>
          <hr />
          <div className="cart-total-elements">
            <p className='total-bold'><b>Total</b></p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <button className='cart-total-btn' type='button' onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="promo-code-div">
          <p>If you have a promo code, Enter it here</p>
          <div className="promo-code">
            <input className='promo-code-input' type="text" placeholder='promo code' />
            <button className='promo-code-btn' type='button'>Submit</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
