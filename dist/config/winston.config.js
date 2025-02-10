"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const __1 = require("..");
(0, dotenv_1.config)();
const logDirectory = node_path_1.default.resolve('logs');
const customColors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green'
};
winston_1.default.addColors(customColors);
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory, { recursive: true });
}
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, service }) => {
        return `[${timestamp}] ${level.toUpperCase()}: [${service}] ${message}`;
    })),
    defaultMeta: { service: 'site-service' },
    transports: []
});
logger.add(new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), // Apply colors to all parts
    winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Include timestamp
    winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }))
}));
// Add file logging with rotation in production mode
if (__1.isProductionEnv) {
    logger.add(new winston_daily_rotate_file_1.default({
        filename: node_path_1.default.join(logDirectory, 'site-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info'
    }));
    logger.add(new winston_daily_rotate_file_1.default({
        filename: node_path_1.default.join(logDirectory, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error'
    }));
}
// Custom error handler
const originalError = logger.error;
logger.error = (msg) => originalError.call(logger, msg);
exports.default = logger;
