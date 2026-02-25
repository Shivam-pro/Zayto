import { useState } from "react";
import "./home.css";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Home = ({ locationAllowed, url, user}) => {
    
    const [orders, setOrders] = useState([]);
    const nevigate = useNavigate();

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/delivery/listorders");
        if (response.data.success) {
            setOrders(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }

    const acceptOrder = async (orderId) => {
        try {
            await axios.post(url + "/api/delivery/updatedeliveryinfo", {
                orderId, assignboy: {
                    boyId: user._id,
                    name: user.name,
                    phone: user.phone
                }
            });
            await axios.post(url + "/api/order/status", { orderId: orderId, status: "Out for delivery" });
            toast.success("order accepted");
            nevigate("/allorders");
        } catch (error) {
            console.log(error);
            toast.error("Server Error");
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [])
    if (!locationAllowed) {
        return (
            <div className="map-container">
                <p>
                    ⚠️ Location access is required to track your order. Please enable
                    location services.
                </p>
            </div>
        );
    }
    return (
        <div className="home-container">
            <div className="welcome-div">
                <h2>Welcome, {user.name}</h2>
            </div>
            {orders.map((order, index) => {
                return (
                    <div key={index} className='order-item'>
                        <div className='order-img'>
                            <img src={assets.parcel_icon} alt="" />
                        </div>
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + 'x' + item.quantity;
                                    }
                                    else {
                                        return item.name + 'x' + item.quantity + ", ";
                                    }
                                })}
                            </p>
                            <p className='order-item-name'>
                                Name: {order.address.firstName + " " + order.address.lastName}
                            </p>
                            <div className='order-item-address'>
                                Address: <p>{order.address.street + ", "}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>
                                Contact: {order.address.phone}
                            </p>
                        </div>
                        <p>Items : {order.items.length}</p>
                        <p>₹{order.amount}</p>
                        <button className="accept-btn" onClick={() => acceptOrder(order._id)}>Accept</button>
                    </div>
                )
            })}
        </div>
    )
}

export default Home
