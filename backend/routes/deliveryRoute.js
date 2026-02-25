import express from 'express';
import { loginDeliveryBoy, registerDeliveryBoy, listValidOrders, updateDeliveryInfo, deliveryBoyOrders } from '../controllers/deliveryController.js';

const deliveryRouter = express.Router();

deliveryRouter.post("/logindeliveryboy", loginDeliveryBoy);
deliveryRouter.post("/registerdeliveryboy", registerDeliveryBoy);
deliveryRouter.get("/listorders", listValidOrders);
deliveryRouter.post("/updatedeliveryinfo", updateDeliveryInfo);
deliveryRouter.post("/deliveryboyorders", deliveryBoyOrders);

export default deliveryRouter;