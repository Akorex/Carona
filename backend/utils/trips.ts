import { BASE_FARE, TIME_RATE, DISTANCE_RATE} from "../config/config"
import Vehicles from "../models/vehicles"
import Routes from "../models/routes"
import ApiError from "../middlewares/errorHandler/api-error"



interface IBasicTrip{
    start: string,
    end: string,
    estimatedTravelTime: string,
    price: string
}



export const prepareInfoForCaronaGoTrip = async (
    routeId: any
) => {
    const vehicle = await Vehicles.aggregate([{ $sample: { size: 1 } }])
    const route = await Routes.findOne({_id: routeId})

    if (!vehicle || vehicle.length === 0){
        return ApiError.badRequest(`Could not create Trip as no available Vehicle`)
    }

    if (!route){
        return ApiError.badRequest(`Could not create Trip as route is Invalid`)
    }

    const vehicleId = vehicle[0]._id;
    const availableSeats: number = vehicle[0].availableSeats;

    if (availableSeats <= 0){
        return ApiError.badRequest(`Could not create trip as no available seat.`)
    }

    const start = route.start
    const end = route.end
    const distance = route.distance
    const estimatedTravelTime = route.estimatedTravelTime
    const price = calculateFare(distance, estimatedTravelTime)
    

    return {
        start,
        end,
        distance,
        estimatedTravelTime,
        vehicleId,
        price
    }

}

export const prepareInfoForCaronaShareTrip = async (
    start: string,
    end: string,
    vehicleId: any
) => {
    const distance = generateDistance()
    const estimatedTravelTime = generateEstimatedTravelTime()
    const price = calculateFare(distance, estimatedTravelTime)

    return {
        start,
        end, 
        distance,
        estimatedTravelTime,
        vehicleId,
        price
    }

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