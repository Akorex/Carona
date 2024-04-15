import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({

})

const walletTransaction = mongoose.model('walletTransaction', walletTransactionSchema)

export default walletTransaction