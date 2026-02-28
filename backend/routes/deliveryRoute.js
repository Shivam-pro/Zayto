import express from 'express';
import { loginDeliveryBoy, registerDeliveryBoy, listValidOrders, updateDeliveryInfo, deliveryBoyOrders, sendOrderOtp, verifyOtp } from '../controllers/deliveryController.js';

const deliveryRouter = express.Router();

deliveryRouter.post("/logindeliveryboy", loginDeliveryBoy);
deliveryRouter.post("/registerdeliveryboy", registerDeliveryBoy);
deliveryRouter.get("/listorders", listValidOrders);
deliveryRouter.post("/updatedeliveryinfo", updateDeliveryInfo);
deliveryRouter.post("/deliveryboyorders", deliveryBoyOrders);
deliveryRouter.post("/sendotp" ,sendOrderOtp);
deliveryRouter.post("/verifyotp" ,verifyOtp);

export default deliveryRouter;