import express, {Application, Request, Response} from 'express'
import { config } from './config/config'
import logger from './utils/logger'
import connectDB from './config/db'
import router from './routes'
import errorHandler from './middlewares/errorHandler'
import notFound from './middlewares/notFound'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'


const app: Application = express()

const swaggerDocument = YAML.load('./swagger.yaml')

// set up
const port = config.port
const mongoUrl = config.uri
const apiVersion = config.apiVersion
app.use(express.json())


// routes
app.get('/', (req: Request, res: Response) => {
    res.send('<h1> Carona - A Carpooling Platform </h1>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(`/api/v${apiVersion}`, router)

// middlewares
app.use(notFound)
app.use(errorHandler)


const start = async () => {
    await connectDB(mongoUrl)
    app.listen(port, () => {
       logger.info(`Server started. Listening on http://localhost:${port}`)
    })
}

start()