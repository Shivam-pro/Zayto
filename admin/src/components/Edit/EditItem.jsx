import { toast } from 'react-toastify'
import axios from 'axios'
import { useState } from 'react'
const EditItem = ({ item, url, setIsEditing, isEditing, fecthList }) => {
    const [image, setImage] = useState(false);

    const updateFood = async (e, item) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        formData.append("id", item._id);
        formData.append("name", form.name.value);
        formData.append("category", form.category.value);
        formData.append("price", Number(form.price.value));
        if (image) {
            formData.append("image", image);
        }
        const response = await axios.post(`${url}/api/food/update`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setImage(false);
            setIsEditing(prev => prev.filter(id => id !== item._id));
            await fecthList();
        }
        else {
            toast.error(response.data.message);
        }
    }
    const handleBtn = () => {
        if (!isEditing.includes(item._id)) {
            setIsEditing(prev => [...prev, item._id]);
        }
    };

    return (
        isEditing.includes(item._id) ? (
            <form key={item._id} className='list-table-format-edit' onSubmit={(e) => updateFood(e,item)}>
                <label htmlFor="image">
                    <div className="edit-image">
                        <img src={image ? URL.createObjectURL(image) : `${url}/images/` + item.image} alt="" />
                    </div>
                </label>
                <input name='image' type="file" id='image' hidden onChange={(e) => setImage(e.target.files[0])} />
                <input className='edit-name' type="text" defaultValue={item.name} name="name" />
                <input className='edit-category' type="text" defaultValue={item.category} name="category" />
                <input className='edit-price' type="number" defaultValue={item.price} name="price" />
                <button type="submit" className='edit-btn'><i className="fa-solid fa-check"></i></button>
            </form>
        ) : (
            <div key={item._id} className='list-table-format-edit'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <button className='edit-btn' onClick={handleBtn}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
        )
    );
};

export default EditItem;
