import Transactions from "../models/transactions";
import {Request, Response, NextFunction} from 'express'
import logger from '../utils/logger'
import User from "../models/auth";
import { errorResponse } from "../utils/responses";
import { StatusCodes } from "http-status-codes";
import { generateTransactionId} from "../utils/payments";
import axios from 'axios'
import { FLW_SECRET_KEY } from "../config/config";
import Trips from "../models/trips";




export const payTicket = async (req: Request, res: Response, next: NextFunction) => {
    try{
        logger.info(`START: Pay Ticket Service`)
        const userId = req.user.userId
        const tripId = req.params.id

        // fetch the user and trip
        const user = await User.findOne({_id: userId})
        const trip = await Trips.findOne({_id: tripId})
        

        if (!user){
            logger.info(`END: Pay Ticket Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `User does not exist`
            )
        }

        if (!trip){
            logger.info(`END: Pay Ticket Service`)
            return errorResponse(res,
                StatusCodes.BAD_REQUEST,
                `Trip does not exist`
            )
        }


        const email = user.email
        const name = user.firstName + ' ' + user.lastName
        const amount = parseInt(trip.price.split(' ')[1])

        console.log(amount)
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


        // to do -> replace flutterwave with paystack

        try{
        const instance = axios.create({
                baseURL: 'https://api.flutterwave.com/v3/payments',
                headers: {Authorization: `Bearer ${FLW_SECRET_KEY}`}
              });

        const response = await instance.post("/", {
                tx_ref: newTransaction.transactionId,
                amount: newTransaction.amount,
                currency: newTransaction.currency,
                redirect_url: 'https://carona-fe.netlify.app/',
                
                customer: {
                    email,
                    name: name
        }})


        res.status(200).send(response.data)
    }catch(error){
        console.log(error)
    }
    }catch(error){
        logger.error(`Failed to pay ticket ${error}`)
        next(error)
    }
}
