
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Carona - A Carpooling Platform",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:4200",
                description: "Local server"
            }
        ],
    },

    apis: ["../routes/*.ts"]
}

export default swaggerOptions