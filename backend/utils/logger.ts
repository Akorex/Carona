import { createLogger, format, transports, addColors } from "winston";

const {combine, timestamp, colorize, printf} = format
const logFormat = printf(( {timestamp, level, message}) => `${timestamp} ${level}: ${message}`)

const logger = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat,
        colorize({all: true})
    ),
    transports: [
        new transports.File({filename: 'log/error.log', level: 'error'}),
        new transports.File({filename: 'log/combined.log'}),
        new transports.Console({format: combine(logFormat, colorize({all: true}))})
    ]
})

addColors({
    error: 'bold red',
    warn: 'bold yellow',
    info: 'bold cyan',
    debug: 'bold green'
})

export default logger