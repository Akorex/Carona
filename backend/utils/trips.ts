import { BASE_FARE, TIME_RATE, DISTANCE_RATE} from "../config/config"


interface IBasicTrip{
    start: string,
    end: string,
    estimatedTravelTime: string,
    price: string
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

    const departureTime = "09:00 AM" // placeholder startTime
    const departureHour = parseInt(departureTime.split(":")[0])
    const departureMinute = parseInt(departureTime.split(":")[1])
    const departureDate = new Date();
    departureDate.setHours(departureHour, departureMinute, 0, 0);


    const estimatedTravelTimeInMilliseconds = (parseInt(estimatedTravelTime.split(' ')[0])) * 60 * 1000
    const arrivalTimeInMilliseconds = departureDate.getTime() + estimatedTravelTimeInMilliseconds

    const arrivalTime = (new Date(arrivalTimeInMilliseconds)).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
  
    const data = {
        start, end, estimatedTravelTime, price, departureTime, arrivalTime
    }

    return data

    


}