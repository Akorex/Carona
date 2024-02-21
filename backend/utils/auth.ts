import {randomBytes} from 'node:crypto'


interface ISchemaDefault{
    type:
    | StringConstructor
    | NumberConstructor
    | DateConstructor
    | BooleanConstructor
    | StringConstructor[]

    default: null | string | number | Date | boolean
}


export const getTypeAndDefaultValue = (type:
    | StringConstructor
    | NumberConstructor
    | DateConstructor
    | BooleanConstructor
    | StringConstructor[],
    defaultValue: null | string | number | Date | boolean): ISchemaDefault => {


    return {
        type,
        default: defaultValue
    }
}


export const generateRandomTokens = () => {
    const random = randomBytes(32)

    return random.toString('hex')
}

export const generateSignupOTP = () => {
    const digits = '0123456789'
    let otp = ''

    for (let i = 0; i < 6; i++){
        otp += digits[Math.floor(Math.random() * digits.length)]
    }

    return otp
}

export const isTokenValid = () => {
    
}