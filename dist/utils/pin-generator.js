"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPin = generateRandomPin;
exports.setPinExpiryDate = setPinExpiryDate;
exports.isPinExpired = isPinExpired;
const node_crypto_1 = __importDefault(require("node:crypto"));
function generateRandomPin(length = 10, type) {
    const charSets = {
        numeric: '123456789',
        num: '123456789',
        alphabetic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        alphanum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    };
    const charSet = type ? charSets[type] : charSets['numeric'];
    const charSetLength = charSet.length;
    let pin = '';
    while (pin.length < length) {
        const randomBytes = node_crypto_1.default.randomBytes(1);
        const randomValue = randomBytes[0];
        if (randomValue < charSetLength) {
            pin += charSet[randomValue];
        }
    }
    return pin;
}
function setPinExpiryDate(validityPeriod) {
    const [n, t] = validityPeriod.split(' ');
    const num = parseInt(n, 10);
    let multiplier;
    if (t.includes('minute')) {
        multiplier = 60 * 1000; // Minutes to milliseconds
    }
    else if (t.includes('hour')) {
        multiplier = 60 * 60 * 1000; // Hours to milliseconds
    }
    else {
        throw new Error("Invalid time unit. Only 'minutes' or 'hours' are supported.");
    }
    const expiryTime = Date.now() + num * multiplier;
    return new Date(expiryTime);
}
function isPinExpired(expiryTime) {
    const currentTime = Date.now();
    return new Date(currentTime) > new Date(expiryTime);
}
