import foodModel from "../models/foodModels.js";
import fs from "fs";

// Add food items
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }

}

// Add food list items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Remove Food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { });
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food item removed" });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}
// update Food Items
const updateFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // If a new image is uploaded, delete the old one and update the image field
        if (req.file) {
            fs.unlink(`uploads/${food.image}`, () => { });
            food.image = req.file.filename;
        }

        // Update other fields
        food.name = req.body.name || food.name;
        food.description = req.body.description || food.description;
        food.price = req.body.price || food.price;
        food.category = req.body.category || food.category;

        await food.save();
        res.json({ success: true, message: "Food item updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food item" });
    }
}
const ratingFood = async (req, res) => {
    try {
        const { itemId, rating } = req.body;
        if (!itemId || !rating) {
            return res.json({ success: false, message: "ItemId and rating required" })
        }
        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 tp 5' });
        }
        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) {
            return res.json({ success: false, message: "Food item not found" });
        }
        const newCount = foodItem.rating.count + 1;
        const newAverage = (foodItem.rating.average*foodItem.rating.count + rating) / newCount
        foodItem.rating.count = newCount;
        foodItem.rating.average = newAverage;
        await foodItem.save();
        res.json({success: true, message: "ThankYou for rating", rating: foodItem.rating})
    } catch (error) {
        res.json({success: false, message: "Server error in rating"});
    }

}
export { addFood, listFood, removeFood, updateFood, ratingFood }