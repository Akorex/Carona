interface IBasicVehicle {
    type: string,
    model: string,
    colour: any,
    plateNumber: string,
    availableSeats: number,
    driverId: any
}

export const getBasicVehicleDetails = (vehicle: IBasicVehicle) => {
    const {
        type,
        model,
        colour,
        plateNumber,
        availableSeats,
        driverId
    } = vehicle

    return {
        type,
        model,
        colour,
        plateNumber,
        availableSeats,
        driverId
    }
}