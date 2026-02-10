import React, { useContext, useState } from 'react'
import './login.css'
import { Storecontext } from '../../context/Storecontext'
import axios from "axios"

const Login = ({showlogin}) => {

    const {url, setToken} = useContext(Storecontext);

    const [loginSignin, setLoginSignin] = useState("login")
    const [data, setData] = useState({
        name:"",
        email:"",
        password:""
    })
    const onChangeHandler = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setData(data=>({...data,[name]:value}));
    }
    const onLogin = async(e) => { 
        e.preventDefault();
        let newUrl = url;
        if(loginSignin === "login"){
            newUrl += "/api/user/login"
        }
        else{
            newUrl += "/api/user/register"
        }
        const response = await axios.post(newUrl, data);
        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            showlogin(false)
        }
        else{
            alert(response.data.message);
        }
    }
    return (
        <div className='login'>
            <form onSubmit={onLogin} className="login-container">
                <div className="login-heading">
                    <h2>{loginSignin === "login" ?"Login": "Sign in"}</h2>
                    <i className="fa-solid fa-xmark" onClick={()=>showlogin(false)}></i>
                </div>
                {loginSignin === "login" ? <></>: <input name='name' onChange={onChangeHandler} value={data.name} type="text" className='input-box' placeholder='Your Name' />}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" className='input-box' placeholder='Your Email' />
                <input name="password" onChange={onChangeHandler} value={data.password} type='password' className='input-box' placeholder='Password' />
                <button type='submit' className='input-box login-btn'>{loginSignin === "login" ? "Login": "Create account"}</button>
                <div className='confirm'>
                    <input className='checkbox' type="checkbox" />
                    <label htmlFor="confirm">By continuing, i agree to the terms of use & privacy policy.</label>
                </div>
                <p>{loginSignin === "login" ? "Create a new account?": "Already have an account?"} <span className='click-here' onClick={()=>loginSignin === "login" ? setLoginSignin("signin"): setLoginSignin("login")}>{loginSignin === "login" ? "Click here": "Login here"}</span></p>
            </form>
        </div>
    )
}

export default Login
