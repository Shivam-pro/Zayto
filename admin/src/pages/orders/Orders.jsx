import React from 'react'
import './orders.css'
import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

const Orders = ({url}) => {
  const [orders, setOrders] =  useState([]);
  const fetchAllOrders = async()=>{
    const response = await axios.get(url+"/api/order/list");
    if(response.data.success){
      setOrders(response.data.data);
    }
    else{
      toast.error("Error");
    }
  }

  const statusHandler = async(event, orderId)=>{
    const response = await axios.post(url+"/api/order/status", {orderId, status: event.target.value})
    if(response.data.success){
      await fetchAllOrders();
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.map((order, index)=>{
          return(
            <div key={index} className='order-item'>
              <div className='order-img'>
              <img src={assets.parcel_icon} alt="" />
              </div>
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, index)=>{
                    if(index === order.items.length-1){
                      return item.name + 'x' + item.quantity;
                    }
                    else{
                      return item.name + 'x' + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className='order-item-name'>
                  {order.address.firstName +" "+ order.address.lastName}
                </p>
                <div className='order-item-address'>
                  <p>{order.address.street+", "}</p>
                  <p>{order.address.city+", " +order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>
                  {order.address.phone}
                </p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select onChange={(event)=>statusHandler(event, order._id)} value={order.status}>
                <option value="Pending">Pending</option>
                <option value="Food Proccessing" disabled={!order.payment}>Food Proccessing</option>
                <option value="Out for delivery" disabled={!order.payment}>Out for delivery</option>
                <option value="Delivered" disabled={!order.payment}>Delivered</option>
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
