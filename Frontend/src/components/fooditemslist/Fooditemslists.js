import React, { useContext } from 'react'
import './fooditemslist.css'
import { Storecontext } from '../../context/Storecontext'
import Fooditem from '../fooditem/Fooditem'
import Loader from '../loader/Loader'

const Fooditemslist = ({ category }) => {
  const { food_list, loader } = useContext(Storecontext);

  return (
    <div className={loader ? "food-container" : "food-items-list-container"}>
      {
        !loader ?
          food_list.map((item, index) => {
            if (category === "All" || category === item.category) {
              return (
                <Fooditem key={index} id={item._id} image={item.image} name={item.name} description={item.description} price={item.price} />
              )
            }
          }) :
          <Loader />
      }
    </div>
  )
}

export default Fooditemslist