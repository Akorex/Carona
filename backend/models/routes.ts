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

    stops: [{
        type: [String] // stops available from Google Maps
    }],

    distance: {
        type: Number, // all distances are in kilometers
        required: true
    }
})

const Routes = mongoose.model('Routes', RouteSchema)

export default Routes