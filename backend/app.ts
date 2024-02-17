import express, {Application, Request, Response} from 'express'
import { config } from './config/config'
import logger from './utils/logger'
import connectDB from './config/db'
import router from './routes'


const app: Application = express()

// set up
const port = config.port
const mongoUrl = config.uri
const apiVersion = config.apiVersion

// routes
app.get('/', (req: Request, res: Response) => {
    res.send('<h1> Carona - A Carpooling Platform </h1>')
})
app.use(`/api/v${apiVersion}`, router)


const start = async () => {
    await connectDB(mongoUrl)
    app.listen(port, () => {
       logger.info(`Server started. Listening on http://localhost:${port}`)
    })
}

start()