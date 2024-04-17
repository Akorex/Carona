import { randomBytes } from "crypto"
import User from "../models/auth"

export const generateTransactionId = () => {
    const random = randomBytes(16)

    const transactionId = 'trx-' + random.toString('hex')

    return transactionId
}

export const fetchUserDetails = async (userId: string) => {
    const user = await User.findOne({userId})

    if (!user){
        return 
    }

    const email = user.email
    const name = user.firstName + ' ' + user.lastName

    return {email, name}
}