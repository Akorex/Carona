import { BASE_FARE, TIME_RATE, DISTANCE_RATE} from "../config/config"
import Vehicles from "../models/vehicles"
import Routes from "../models/routes"

interface IBasicTrip{
    start: string,
    end: string,
    estimatedTravelTime: string,
    price: string
}



export const validateVehicleAndRoute = async (
    vehicleId: any,
    routeId: any
) => {

}


























export const calculateFare = (distance: string, time: string) => {
    const baseFee = BASE_FARE

    const distanceInt = parseInt(distance.split(' ')[0])
    const distanceFee = distanceInt * DISTANCE_RATE

    const timeInt = parseInt(time.split(' ')[0])
    const timeFee = timeInt * TIME_RATE

    const fare = baseFee + distanceFee + timeFee
    
    return "NGN " + (Math.round(fare / 100) * 100)
}

export const generateDistance = () => {

    const distance: Number = Math.floor(Math.random() * 100) + 1;
    return distance + " km"
}

export const generateEstimatedTravelTime = () => {

    const time: Number = Math.floor(Math.random() * 1000) + 1;
    return time + " mins"
}



export const getBasicTripDetails = (trip: IBasicTrip) => {
    const {
        start,
        end,
        estimatedTravelTime,
        price
    } = trip

    return {
        start,
        end, 
        estimatedTravelTime,
        price
    }


}