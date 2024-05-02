import {randomBytes} from 'node:crypto'
import {compareSync, genSaltSync, hashSync} from "bcryptjs"
import { verify, sign, JwtPayload } from 'jsonwebtoken'
import {jwt_secret, jwt_lifetime} from "../config/config"
import otpGenerator from 'otp-generator'
import { google } from 'googleapis'


interface ISchemaDefault{
    type:
    | StringConstructor
    | NumberConstructor
    | DateConstructor
    | BooleanConstructor
    | StringConstructor[]

    default: null | string | number | Date | boolean
}

export interface Timestamps {
    createdAt: Date,
    updatedAt: Date
}

export interface IBasicUser extends Timestamps {
    _id: any,
    firstName: string,
    lastName: string,
    phoneNumber: any,
    email: string,
    gender: string
}

interface IJWToken {
    token: string,
    expiresAt: number
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


export interface AuthResponseData {
    user: IBasicUser,
    jwt: IJWToken
}



export const generateRandomToken = () => {
    const random = randomBytes(32)

    return random.toString('hex')
}

export const generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, 
        specialChars: false });
}

export const isTokenValid = (token: string) => {
    return verify(token, jwt_secret)   
}

export const generateHashedValue = (value: string) => {
    const salt = genSaltSync(10)

    return hashSync(value, salt)
}

export const getBasicUserDetails = (user: IBasicUser) => {
    const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        email,
        gender,
        createdAt,
        updatedAt
    } = user

    return {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        gender,
        createdAt,
        updatedAt
    }

}

export const createAccessToken = (id: any) => {
    const token: string = sign({id}, jwt_secret, {expiresIn: jwt_lifetime})
    const expiresAt: number = (verify(token, jwt_secret) as JwtPayload).exp || Date.now()

    return {token, expiresAt}
}

export const checkValidity = (value: string, otherValue: string) => {
    return compareSync(value, otherValue)
}

export const getGoogleUserProfile = async (accessToken: string) => {
    const {data} = await google.people('v1').people.get({
        access_token: accessToken,
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
    })

    console.log(data)

    const profile = {
        firstName : data.names?.[0].givenName ?? '',
        lastName : data.names?.[0].familyName ?? ' ',
        email: data.emailAddresses?.[0].value ?? ' '
    }

    return profile

}
