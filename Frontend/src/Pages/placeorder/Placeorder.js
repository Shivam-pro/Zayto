import React, { useContext, useEffect, useState } from 'react'
import './Placeorder.css'
import { Storecontext } from '../../context/Storecontext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Placeorder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(Storecontext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()+20
    }
    let response = await axios.post(url+"/api/order/place",orderData,{ headers: {token} });
    console.log(response.data)
    if(response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url);
    }
    else{
      alert(response.data.message || "Error");
    }
  }
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      navigate("/cart");
    }
    else if(getTotalCartAmount() === 0){
      navigate('/cart');
    }
  },[token])

  return (
    <form className='place-order-container form-info' onSubmit={placeOrder}>
      <div className="delivery-info">
        <h1>Delivery Information</h1>
        <div className='place-order-right'>
          <div className="form-design">
            <input name='firstName' type="text" placeholder='First name' onChange={onchangeHandler} value={data.firstName} required/>
            <input name='lastName' type="text" placeholder='Last name' onChange={onchangeHandler} value={data.lastName} required/>
          </div>
          <input name='email' type="email" placeholder='Email address' onChange={onchangeHandler} value={data.email} required/>
          <input name='street' type="text" placeholder='Street' onChange={onchangeHandler} value={data.street} required/>
          <div className="form-design">
            <input name='city' type="text" placeholder='City' onChange={onchangeHandler} value={data.city} required/>
            <input name='state' type="text" placeholder='State' onChange={onchangeHandler} value={data.state} required/>
          </div>
          <div className="form-design">
            <input name='zipcode' type="text" placeholder='Zip code' onChange={onchangeHandler} value={data.zipcode} required/>
            <input name='country' type="text" placeholder='Country' onChange={onchangeHandler} value={data.country} required/>
          </div>
          <input name='phone' type="number" placeholder='Phone' onChange={onchangeHandler} value={data.phone} required/>
        </div>
      </div>
      <div className="place-order-right">
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
        <button className='cart-total-btn' type='submit'>PROCEED TO PAYMENT</button>
      </div>
    </form>
  )
}

export default Placeorder
