import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    model: {
        type: String,
        required: true
    },

    colour: {
        type: String
    },

    plateNumber: {
        type: String,
        required: true,
        unique: true
    },

    availableSeats: {
        type: Number,
        default: 3
    },

    driverId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

const Vehicles = mongoose.model(`Vehicles`, vehicleSchema)

export default Vehicles