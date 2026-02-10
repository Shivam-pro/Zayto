// import React from 'react'
// import { assets } from '../../assets/assets'

// const FormItem = ({item, image, url, isEditing}) => {
//     return (
//         {item._id === isEditing.includes(item._id)
//         ? 
//         <form key={item._id} className='list-table-format-edit'>
//         <label htmlFor="image">
//         <div className="edit-image">
//         <img src={image ? URL.createObjectURL(image) : `${url}/images/` + item.image} alt="" />
//         </div>
//         </label>
//         <input name='image' type="file" id='image' hidden required onChange={(e) => setImage(e.target.files[0])} />
//         <input className='edit-name' type="text" defaultValue={item.name} name="name" />
//         <input className='edit-category' type="text" defaultValue={item.category} name="category" />
//         <input className='edit-price' type="number" defaultValue={item.price} name="price" />
//         <button className='edit-btn'><i className="fa-solid fa-check"></i></button>
//         </form>
//         :
//     }
//     )
// }

// export default FormItem
