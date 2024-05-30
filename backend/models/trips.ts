import mongoose, {Schema} from "mongoose";

const tripSchema = new mongoose.Schema({
    start: {
        type: String,
        required: [true, 'A take-off location is required for every trip']
    },

    end: {
        type: String, 
        required: [true, 'A destination is required for every trip']
    },

    passengers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    distance: {
        type: String, // all distances are measured in kilometers
        required: true
    },

    price: {
        type: String, // all prices are in NGN
        required: true
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: "Vehicles"
    },

    ratings: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 5
    }

}, {timestamps: true})

const Trips = mongoose.model('Trips', tripSchema)

export default Trips