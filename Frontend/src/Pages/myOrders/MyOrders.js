import React, { useContext, useEffect, useState } from 'react'
import './myorder.css'
import { Storecontext } from '../../context/Storecontext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const MyOrders = () => {
    const nevigate = useNavigate();
    const { url, token, } = useContext(Storecontext);
    const [data, setData] = useState([]);
    const [rating, setRating] = useState({})

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
        const ratingsObj = {};
        response.data.data.forEach(order => {
            order.items.forEach(item => {
                if (item.rating) {
                    ratingsObj[item._id] = item.rating;
                }
            });
        });
        setRating(ratingsObj);
    }
    
    function formatDate(date) {
        const [datePart] = date.split("T");
        const [year, month, day] = datePart.split("-");
        return `${day}-${month}-${year}`;
    }
    const handleRatingStar = async (itemId, star) => {
        try {
            await axios.post(url + "/api/food/rating", { itemId: itemId, rating: star });
            setRating(prev => ({ ...prev, [itemId]: star }));
            console.log(star)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])
    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    return (
                        <div key={index} className='myorder-container'>
                            <p className='orderid'>orderId: {order._id}</p>
                            <div className='order-status'>
                                <p className='status'>{order.status}</p>
                                <p>{formatDate(order.date)}</p>
                            </div>
                            <div className='myorder-box-container'>
                                <p>Delivery Boy: {order.assignboy.name ? order.assignboy.name : "Your order is not assigned yet"}</p>
                                <div className='all-order-items'>
                                    {order.items.map((item, index) => {
                                        return (
                                            <div className='order-box' key={index}>
                                                <div className='order-food-card'>
                                                    <img src={`${url}/images/` + item.image} alt="" />
                                                    <p className='item-name'>{item.name}</p>
                                                    <p className='font'>Qty: {item.quantity} x ₹{item.price}</p>
                                                    {order.status == "Delivered" ?
                                                        <div className='rating'>
                                                            {[1, 2, 3, 4, 5].map((star, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        {rating[item._id] >= star ? <i className="fa-solid fa-star yellow"></i> :
                                                                            <i className="fa-regular fa-star yellow" onClick={() => handleRatingStar(item._id, star)}></i>
                                                                        }
                                                                    </div>
                                                                )
                                                            })
                                                            }
                                                        </div>
                                                        : ""
                                                    }

                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                                <p>Subtotal: ₹{order.amount - 20}</p>
                            </div>
                            <div className='order-status'>
                                <p>Total: ₹{order.amount}</p>
                                {order.status === "Out for delivery" ? <button onClick={() => { nevigate('/trackorder', { state: order }) }} className='track-btn'>Track Order</button> : ""}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders
