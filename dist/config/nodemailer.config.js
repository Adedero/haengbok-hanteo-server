"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
const __1 = require("..");
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport(Object.assign(Object.assign({}, (__1.isProductionEnv && { service: process.env.EMAIL_SERVICE })), { host: process.env.EMAIL_HOST, port: 465, secure: true, auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    } }));
exports.default = transporter;
