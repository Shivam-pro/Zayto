import deliveryBoy from "../models/deliveryModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import orderModel from "../models/orderModels.js";
import nodemailer from "nodemailer";

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

function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// API for sending order otp
const sendOrderOtp = async(req, res)=>{
    try {
        const order = await orderModel.findById(req.body.orderId).populate("userId");
        if(!order){
            return res.json({success: false, message: "Order not found"});
        }
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiry = new Date(Date.now() + 5*60000);

        order.otp = hashedOtp;
        order.otpExpiry = expiry;
        await order.save();
        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.APP_PASS
            }
        })
        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: order.address.email,
            subject: "Your Delivery OTP",
            text: `Your OTP for order ${order._id} is ${otp}. It expires in 5 minutes.`
        })
        res.json({success: true, message: "OTP send to user email"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error sending otp"});
    }
}

const verifyOtp = async(req, res)=>{
    const {orderId, enteredOtp} = req.body;
    try {
        const order = await orderModel.findById(orderId);
        if(!order || !order.otp){
            return res.json({success: false, message: "No otp found"});
        }
        const isMatch = await bcrypt.compare(enteredOtp, order.otp)
        if(isMatch && new Date() < order.otpExpiry){
            order.status = "Delivered"
            order.otp = null
            order.otpExpiry = null
            await order.save()
            res.json({success: true, message: "Order Mark as Delivered"});
        }
        else{
            res.json({success: false,message: "Invalid OTP or OTP expires"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error Verification OTP"});
    }
}
export { loginDeliveryBoy, registerDeliveryBoy, listValidOrders, updateDeliveryInfo, deliveryBoyOrders, sendOrderOtp, verifyOtp }