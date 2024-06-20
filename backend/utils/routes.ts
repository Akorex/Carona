import Routes from "../models/routes"

interface IBasicRoute{
    _id: any
    start: string,
    end: string,
    distance: string,
    estimatedTravelTime: string,
    startLatLong: string,
    endLatLong: string

}

export const getBasicRouteDetails = (route: IBasicRoute) => {
    const {
        _id,
        start,
        end, 
        distance,
        estimatedTravelTime,
        startLatLong,
        endLatLong
    } = route

    return {
        _id,
        start,
        end,
        distance,
        estimatedTravelTime,
        startLatLong,
        endLatLong
    }
}

export const getBasicRouteCoordinates = async (routeId: any) => {
    
    const route = await Routes.findOne({_id: routeId})

    let startLatLong = ''
    let endLatLong = ''
    
    if (!route){
        startLatLong =  '6.5162173597908, 3.3905528025338283' // placeholder for CaronaShare coordinates
        endLatLong = '6.559633599898055, 3.3689000521288275'
    }else{
        startLatLong = route.startLatLong
        endLatLong = route.endLatLong
    }

    return {
        startLatLong,
        endLatLong
    }
}