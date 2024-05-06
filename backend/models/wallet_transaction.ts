import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        default: 0.0
    },

    isInflow: {
        type: Boolean
    },
    
    paymentMethod: {
        type: String,
        default: 'flutterwave'
    },

    currency: {
        type: String,
        required: [true, 'currency is required'],
        enum: ["NGN", "USD", "EUR", "GBP"]
    },

    status: {
        type: String,
        required: [true, 'payment status is required'],
        enum: ['successful', 'pending', 'failed']
    }

}, {timestamps: true})

const walletTransaction = mongoose.model('walletTransaction', walletTransactionSchema)

export default walletTransaction