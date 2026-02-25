import express from "express";
import cors from "cors";
import 'dotenv/config'
import { connectToDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import deliveryRouter from "./routes/deliveryRoute.js";
import http from "http";
import { Server } from "socket.io";

// app config
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3001","http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

// Socket.io
io.on("connection", (socket) => {
    // console.log("User Connected: ", socket.id);c

    //User joins a room
    socket.on('joinRoom', ({roomId})=>{
        socket.join(roomId);
        // console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    //Delivery boy sends location update
    socket.on('locationUpdate', ({roomId, longitude, latitude})=>{
        // console.log(`Location update from ${socket.id} in room ${roomId}:`, latitude, longitude);
        //Broadcast only to users in this room
        socket.to(roomId).emit("locationUpdate", { latitude, longitude });
    })
    socket.on("disconnect", ()=>{
        console.log("Client disconnected: ", socket.id);
    });
});

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectToDB();

// Api endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/delivery', deliveryRouter);


app.get("/", (req, res) => {
    res.send("API Working")
})

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server runnign on http://localhost:${PORT}`);
})