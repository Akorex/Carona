export const calculateFare = (value: string) => {
    const distance = parseInt(value.split(' ')[0])
    
    return 5 * distance
}