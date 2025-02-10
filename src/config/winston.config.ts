import { config } from 'dotenv'
import winston from 'winston'
import fs from 'fs'
import path from 'node:path'
import DailyRotateFile from 'winston-daily-rotate-file'
import { isProductionEnv } from '..'

config()

const logDirectory = path.resolve('logs')

const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  debug: 'green'
}

winston.addColors(customColors)

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true })
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, service }) => {
      return `[${timestamp}] ${level.toUpperCase()}: [${service}] ${message}`
    })
  ),
  defaultMeta: { service: 'site-service' },
  transports: []
})

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }), // Apply colors to all parts
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Include timestamp
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`
      })
    )
  })
)

// Add file logging with rotation in production mode
if (isProductionEnv) {
  logger.add(
    new DailyRotateFile({
      filename: path.join(logDirectory, 'site-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    })
  )

  logger.add(
    new DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    })
  )
}

// Custom error handler
const originalError = logger.error
logger.error = (msg) => originalError.call(logger, msg)

export default logger
