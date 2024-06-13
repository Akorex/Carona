interface IBasicRoute{
    start: string,
    end: string,
    distance: string,
    estimatedTravelTime: string,
    startLatLong: string,
    endLatLong: string

}

export const getBasicRouteDetails = (route: IBasicRoute) => {
    const {
        start,
        end, 
        distance,
        estimatedTravelTime,
        startLatLong,
        endLatLong
    } = route

    return {
        start,
        end,
        distance,
        estimatedTravelTime,
        startLatLong,
        endLatLong
    }
}