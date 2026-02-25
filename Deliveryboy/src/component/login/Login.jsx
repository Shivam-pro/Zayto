import { useState } from 'react';
import './login.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ url, setToken, setUser }) => {

    const [loginSignin, setLoginSignin] = useState("login");
    const nevigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    })
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({ ...data, [name]: value }));
    }
    const onLogin = async (e) => {
        e.preventDefault();
        let newUrl = url;
        if (loginSignin === "login") {
            newUrl += "/api/delivery/logindeliveryboy"
        }
        else {
            newUrl += "/api/delivery/registerdeliveryboy"
        }
        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("deliveryuser", JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            toast.success(response.data.message);
            nevigate("/home")
        }
        else {
            toast.error("Internal server Error");
        }
    }
    return (
        <div className='login'>
            <form onSubmit={onLogin} className="login-container">
                <div className="login-heading">
                    <h2>{loginSignin === "login" ? "Login" : "Sign in"}</h2>
                </div>
                {loginSignin === "login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" className='input-box' placeholder='Your Name' />}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" className='input-box' placeholder='Your Email' />
                {loginSignin === "login" ? <></> : <input name="phone" onChange={onChangeHandler} value={data.phone} type='number' className='input-box' placeholder='phone Number' />}
                <input name="password" onChange={onChangeHandler} value={data.password} type='password' className='input-box' placeholder='Password' />
                <button type='submit' className='input-box login-btn'>{loginSignin === "login" ? "Login" : "Create account"}</button>
                <div className='confirm'>
                    <input className='checkbox' type="checkbox" />
                    <label htmlFor="confirm">By continuing, i agree to the terms of use & privacy policy.</label>
                </div>
                <p>{loginSignin === "login" ? "Create a new account?" : "Already have an account?"} <span className='click-here' onClick={() => loginSignin === "login" ? setLoginSignin("signin") : setLoginSignin("login")}>{loginSignin === "login" ? "Click here" : "Login here"}</span></p>
            </form>
        </div>
    )
}

export default Login
