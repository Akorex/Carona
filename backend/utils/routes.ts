interface Iroute {
    start: string,
    end: string,
    distance: string
}



export const getBasicRouteInfo = async (route: Iroute) => {
    const {
        start,
        end,
        distance
    } = route

    return {
        start, 
        end, 
        distance
    }

}