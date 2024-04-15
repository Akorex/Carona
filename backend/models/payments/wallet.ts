import mongoose, { Schema } from "mongoose";

const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0.0
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

}, {timestamps: true})

const Wallet = mongoose.model('Wallet', walletSchema)

export default Wallet