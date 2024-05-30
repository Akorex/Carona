import { randomBytes } from "crypto"


export const generateTransactionId = () => {
    const random = randomBytes(16)

    const transactionId = 'trx-' + random.toString('hex')

    return transactionId
}
