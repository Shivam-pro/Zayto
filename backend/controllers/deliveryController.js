import deliveryBoy from "../models/deliveryModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import orderModel from "../models/orderModels.js";

// Login Delivery boy
const loginDeliveryBoy = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await deliveryBoy.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }
        const token = createToken(user._id);
        res.json({ success: true, token, message: "User login successfully", user});
    } catch (error) {
        res.json({ success: false, message: "Error: Login" });
    }
}
// created a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// register a delivery boy
const registerDeliveryBoy = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const exist = await deliveryBoy.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exist" });
        }
        if (!validator.isEmail) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter password more than 8 characters" })
        }
        //Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new deliveryBoy({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            location: {
                type: "Point",
                coordinates: [0,0],
            }
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token, message: "User registered successfully", user});
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error: register" });
    }
}
// Listing orders for delivery boy.
const listValidOrders = async(req, res)=>{
    try {
        const orders = await orderModel.find({payment: true, assignboy: {boyId: "", name: "", phone: ""}});
        res.json({success: true, data: orders}
        )
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"});
    }
}
// Adding delivery boy info in orders.
const updateDeliveryInfo = async(req, res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {assignboy: req.body.assignboy});
        res.json({success:true, message: "Delivery boy assinged"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

const deliveryBoyOrders = async(req, res)=>{
    try {
        const orders = await orderModel.find({"assignboy.boyId": req.body.boyId});
        res.json({success: true, orders: orders});
    }
    catch(error){
        res.json({success: false, message: "Error: Getting delivery boy orders failed"});
    }
}

export { loginDeliveryBoy, registerDeliveryBoy, listValidOrders, updateDeliveryInfo, deliveryBoyOrders }