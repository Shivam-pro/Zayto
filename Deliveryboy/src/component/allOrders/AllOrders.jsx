import axios from 'axios'
import { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './allorders.css'
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from 'react-router-dom';

const AllOrders = ({ url, user }) => {
    const [allOrders, setAllOrders] = useState([])
    const nevigate = useNavigate()
    const deliveryOrders = async () => {
        const response = await axios.post(url + "/api/delivery/deliveryboyorders", { boyId: user._id });
        if (response.data.success) {
            setAllOrders(response.data.orders);
        }
    }
    useEffect(() => {
        deliveryOrders()
    }, [])
    return (
        <div className='orders-container'>
            <h2>Your Accepted orders</h2>
            {allOrders.map((order, index) => {
                return (
                    <div key={index} className='order-item'>
                        {order.status == "Out for delivery" ?
                            <>
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
                                <div className='btns'>
                                <button className='accept-btn' onClick={()=>{nevigate("/trackorder", {state: order})}}>Start Tracking</button>
                                </div>
                            </> :
                            <>
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
                                <p>Delivered</p>
                            </>}

                    </div>
                )
            })}
        </div>
    )
}

export default AllOrders
