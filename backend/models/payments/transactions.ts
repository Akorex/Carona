import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionId: {
        type: Number,
        trim: true
    },
    paymentStatus: {
        type: String,
        enum: ['successful', 'pending', 'failed'],
        default: 'pending'
    },
    paymentGateway: {
        type: String,
        required: [true, 'Payment gateway is required'],
        enum: ['flutterwave']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        enum: ["NGN", "USD", "EUR", "GBP"]

    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    }
}, {
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction