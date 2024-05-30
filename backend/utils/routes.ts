interface IBasicRoute{
    start: string,
    end: string,
    distance: string,
    estimatedTravelTime: string

}

export const getBasicRouteDetails = (route: IBasicRoute) => {
    const {
        start,
        end, 
        distance,
        estimatedTravelTime
    } = route

    return {
        start,
        end,
        distance,
        estimatedTravelTime
    }
}