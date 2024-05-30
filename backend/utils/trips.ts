
export const calculateFare = (value: string) => {
    const distance = parseInt(value.split(' ')[0])
    
    return "NGN " + 5*distance
}

export const generateDistance = () => {

    const distance: Number = Math.floor(Math.random() * 100) + 1;
    return distance + " km"
}