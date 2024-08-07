import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    start: {
        type: String,
        required: true
    },

    end: {
        type: String,
        required: true
    },

    distance: {
        type: String, // all distances are in kilometers
        required: true
    },

    estimatedTravelTime: {
        type: String,// estimated time in minutes
        required: true
    },

    startLatLong: {
        type: String,
        required: true
    },

    endLatLong: {
        type: String,
        required: true
    }
})

const Routes = mongoose.model('Routes', RouteSchema)

export default Routes