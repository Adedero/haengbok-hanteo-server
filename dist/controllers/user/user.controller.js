"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_dashboard_1 = __importDefault(require("./services/get-dashboard"));
const change_password_1 = __importDefault(require("./services/change-password"));
const notifications_1 = require("./services/notifications");
const UserController = {
    getDashboard: get_dashboard_1.default,
    changePassword: change_password_1.default,
    clearUserNotifications: notifications_1.clearUserNotifications,
    updateNotifications: notifications_1.updateNotifications
};
exports.default = UserController;
