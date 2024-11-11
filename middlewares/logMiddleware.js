import winston from 'winston'
import expressWinston from 'express-winston'

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
    winston.format.printf(({timestamp, level, message, meta}) =>{
        return `[${timestamp}] ${level}: ${message} ${meta ? JSON.stringify(meta) : ''}`;
    })
)

export const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logs/combined.log'}),
    ],
})

export const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: (req, res) => false,
})

export const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
})