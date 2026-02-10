import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const Storecontext = createContext(null);

const StoreContextProvier = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [loader, setLoader] = useState(false);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + '/api/cart/add', { itemId }, { headers: { token } });
        }
    }
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + '/api/cart/remove', { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let total = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                total = total + itemInfo.price * cartItems[item];
            }
        }
        return total;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + '/api/food/list');
        if(response.data.success){
            setFoodList(response.data.data);
            setLoader(false);
            console.log(response);
        }
        else{
            setLoader(true);
            console.log("loader", loader);
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + '/api/cart/get', {}, { headers: { token } });
        setCartItems(response.data.cartData);
    }
    
    useEffect(() => {
        async function loadData() {
            await fetchFoodList()
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData()
        if(loadData){
            setLoader(false)
        }
        setLoader(true)
    }, [])

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        setCartItems,
        getTotalCartAmount,
        url,
        token,
        setToken,
        loader,
        setLoader,
    }

    return (
        <Storecontext.Provider value={contextValue}>
            {props.children}
        </Storecontext.Provider>
    )
}
export default StoreContextProvier;
