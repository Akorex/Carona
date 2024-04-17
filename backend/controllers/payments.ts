import Transactions from "../models/payments/transactions";
import {Request, Response, NextFunction} from 'express'
import logger from '../utils/logger'
import User from "../models/auth";
import { errorResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { generateTransactionId,
    fetchUserDetails
 } from "../utils/payments";
import got from 'got'
import { FLW_SECRET_KEY } from "../config/config";

export const payTicket = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Pay Ticket Service`)
        let userId = req.user.userId

        const user = await User.findById({userId})

        if (!user){
            logger.info(`END: Pay Ticket Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `User does not exist`
            )
        }

        const email = user.email
        const name = user.firstName + ' ' + user.lastName
        const amount = 2000 // to be replaced by a function which dynamically computes amount

        const transactionId = generateTransactionId()

        const existingId = await Transactions.findOne({transactionId})

        if (existingId){
            logger.info(`END: Pay Ticket Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `Duplicate Transaction generated`
            )
        }

        const newTransaction = await Transactions.create({
            userId,
            transactionId,
            paymentGateway: 'flutterwave',
            currency: 'NGN',
            amount
        })

        logger.info(`Transaction created successfully in database. Fetching Flutterwave API`)


        const response = await got.post("https://api.flutterwave.com/v3/payments", {
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`
            },

            json: {
                tx_ref: newTransaction.transactionId,
                amount: newTransaction.amount,
                currency: newTransaction.currency,
                
                customer: {
                    email,
                    name: name
                }
        }}).json()

        res.status(200).send(response)

    }catch(error){
        logger.error(`Failed to pay ticket`)
        next(error)
    }
}