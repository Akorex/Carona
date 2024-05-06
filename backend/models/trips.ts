import mongoose, {Schema} from "mongoose";

const TripSchema = new mongoose.Schema({
    start: {
        type: String,
        required: [true, 'A take-off location is required for every trip']
    },

    end: {
        type: String, 
        required: [true, 'A destination is required for every trip']
    },

    passengers: [{
        type: Schema.Types.ObjectId
    }],

    distance: {
        type: Number, // all distances are measured in kilometers
        required: true
    },

    price: {
        type: Number, // all prices are in NGN
        required: true
    },

    vehicleType: {
        type: String,
        enum: ['van', 'bus', 'car'],
        default: 'car'
    }

}, {timestamps: true})

const Trips = mongoose.model('Trips', TripSchema)

export default Trips