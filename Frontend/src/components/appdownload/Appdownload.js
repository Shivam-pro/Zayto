import React from 'react'
import './appdownload.css'
import { assets } from '../../Assets/assets'

const Appdownload = () => {
    return (
        <div className='appdownload' id='appdownload'>
            <h2>For Better Experience Download</h2>
            <h2>FoodDelivery App</h2>
            <div className="download-image">
                <div className="googleplay-image">
                    <img src={assets.googleplay} alt="" />
                </div>
                <div className="appstore-image">
                    <img src={assets.appstore} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Appdownload
