import mongoose, { Schema } from "mongoose";

const deliverySchema = new Schema({
    name:{type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    location: {
        type: { 
            type: String, 
            enum: ["Point"], 
            default: ["Point"]
        }, 
        coordinates: { 
            type: [Number], 
            default: [0,0]
        }
    }
},{timestamps: true});

deliverySchema.index({ location: '2dsphere' });

const deliveryBoy = mongoose.model("deliveryBoy", deliverySchema);

export default deliveryBoy;