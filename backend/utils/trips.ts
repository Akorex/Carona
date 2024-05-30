
interface IBasicTrip{
    start: string,
    end: string,
    estimatedTravelTime: string,
    price: string
}


export const calculateFare = (value: string) => {
    const distance = parseInt(value.split(' ')[0])
    
    return "NGN " + 5*distance
}

export const generateDistance = () => {

    const distance: Number = Math.floor(Math.random() * 100) + 1;
    return distance + " km"
}

export const generateEstimatedTravelTime = () => {
    return "5 mins"
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