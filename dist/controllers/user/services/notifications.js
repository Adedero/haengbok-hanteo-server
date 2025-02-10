"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearUserNotifications = exports.updateNotifications = void 0;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
const updateNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notifications } = req.body;
    if (!notifications) {
        return (0, use_response_1.useResponse)(res, 400, "No notifications provided");
    }
    if (!Array.isArray(notifications)) {
        return (0, use_response_1.useResponse)(res, 400, "Bad request - notifications should be an array");
    }
    try {
        yield Promise.all(notifications.map((notification) => {
            if (!notification._id) {
                throw new Error("Notification ID is required");
            }
            return database_1.db.Notification.updateOne({ _id: notification._id }, { isRead: true });
        }));
        // Send success response
        (0, use_response_1.useResponse)(res, 200, "Notifications updated successfully");
        return;
    }
    catch (error) {
        console.error("Error updating notifications:", error);
        return (0, use_response_1.useResponse)(res, 500, "Failed to update notifications");
    }
});
exports.updateNotifications = updateNotifications;
const clearUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        yield database_1.db.Notification.deleteMany({ user: user._id });
        (0, use_response_1.useResponse)(res, 200, "Notifications cleared successfully");
        return;
    }
    catch (error) {
        console.error(error);
        (0, use_response_1.useResponse)(res, 500, "Failed to clear notifications");
    }
});
exports.clearUserNotifications = clearUserNotifications;
