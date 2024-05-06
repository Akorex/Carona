interface Iroute {
    start: string,
    end: string,
    distance: number
}



export const fetchDistance = async (start: String, end: String) => {

    // implementation depends on Google Maps API
    return 2
}

export const fetchStops = async (start: String, end: String) => {

}

export const getBasicRouteInfo = async (route: Iroute) => {
    const {
        start,
        end,
        distance
    } = route

    return {
        start, 
        end, distance
    }

}