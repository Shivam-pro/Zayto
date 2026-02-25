import './navbar.css';
import { assets } from '../../assets/assets.js';
import { useNavigate } from 'react-router-dom';
const Navbar = ({ token, setToken, setUser, setLatitude, setLongitude  }) => {
    const nevigate = useNavigate();
    const orders = ()=>{
        nevigate("/allorders");
    }
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("deliveryuser");
        setUser("");
        setToken("");
        setLatitude("");
        setLongitude("");
        nevigate("/");
    }
    return (
        <div className='navbar'>
            <div className="image">
                <img src={assets.logo} alt="image"/>
            </div>
            {token ? 
            <div className="navbar-right-box">
                <div className="search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className='navbar-profile'>
                    <i className="fa-solid fa-user size"></i>
                    <ul className='nav-profile-dropdown'>
                        <li ><i className="fa-solid fa-bag-shopping size"></i><span onClick={orders}>Deliveries</span></li>
                        <hr />
                        <li onClick={logout}><i className="fa-solid fa-right-from-bracket size"></i><span>Logout</span></li>
                    </ul>
                </div>
            </div>:<></>
            }
        </div>
    )
}

export default Navbar
