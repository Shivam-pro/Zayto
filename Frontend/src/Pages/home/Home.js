import React, { useState } from 'react'
import './Home.css'
import Hearder from '../../components/header/Header'
import Exploremenu from '../../components/exploremenu/Exploremenu'
import Fooditemslist from '../../components/fooditemslist/Fooditemslists'
import Appdownload from '../../components/appdownload/Appdownload'

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Hearder/>
      <Exploremenu category={category} setCategory={setCategory}/>
      <Fooditemslist category={category}/>
      <Appdownload/>
    </div>
  )
}

export default Home
