import mongoose from "mongoose";

export const connectToDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("DB coneected Successfully")
        })
    } catch (error) {
        console.log("Error in connection: ", error);
    }
} 