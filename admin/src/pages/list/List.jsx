import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import './list.css'
import EditItem from '../../components/Edit/EditItem'
const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState("display");
  
  const [isEditing, setIsEditing] = useState([]);

  const fecthList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error('Error');
    }
  }

  const removeFood = async (id) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: id });
    await fecthList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error");
    }
  }

  useEffect(() => {
    fecthList();
  }, [])

  const handleEdit = () => {
    if (edit === "edit") {
      setEdit("display");
    }
    else {
      setEdit("edit");
    }
  }

  return (
    <div className='list add flex-col'>
      <div className='flex'>
        <p>All Food List</p>
        <p>Edit <span className='edit' onClick={handleEdit}><i className="fa-solid fa-pen-to-square"></i></span></p>
      </div>
      {edit === "display" ?
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item) => {
            return (
              <div key={item._id} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <p className='cross' onClick={() => removeFood(item._id)}>X</p>
              </div>
            )
          })}
        </div>
        :
        <div className="list-table">
          <div className="list-table-format-edit title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
          </div>
          {list.map((item) => {
            return (
              <EditItem item={item} url={url} setIsEditing={setIsEditing} isEditing={isEditing} fecthList={fecthList}/>
            )
          })}
        </div>
      }
    </div>
  )
}

export default List
