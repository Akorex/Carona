import User from "../models/auth"


export interface IBasicVehicle {
    type: string,
    model: string,
    colour: any,
    plateNumber: string,
    availableSeats: number,
    driverId: any
}

export const getBasicVehicleDetails = async (vehicle: IBasicVehicle) => {
    const {
        type,
        model,
        colour,
        plateNumber,
        availableSeats,
        driverId
    } = vehicle


    const driver = await User.findOne({_id: driverId})
    let driverName = ''

    if (!driver){
        driverName = 'Seun Taiwo' // placeholder for CaronaShare driver
        
    }else{
        driverName = driver.firstName + ' ' + driver.lastName
    }


    return {
        type,
        model,
        colour,
        plateNumber,
        availableSeats,
        driverName
    }
}