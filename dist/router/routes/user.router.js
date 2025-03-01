"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../controllers/api/services/helpers");
const user_controller_1 = __importDefault(require("../../controllers/user/user.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/dashboard', user_controller_1.default.getDashboard);
router.route('/transactions')
    .get((0, helpers_1.getAll)('Transaction'));
router.route('/transactions/:id')
    .get((0, helpers_1.getById)('Transaction'));
router.route('/properties')
    .get((0, helpers_1.countAndGetAll)('Property'));
router.route('/properties/:id')
    .get((0, helpers_1.getById)('Property'));
router.route('/notifications')
    .get((0, helpers_1.getAll)('Notification')) //get all notifications
    .put(user_controller_1.default.updateNotifications);
router.delete('/notifications/clear', user_controller_1.default.clearUserNotifications);
router.route('/settings')
    .put(helpers_1.updateSettings);
router.put('/account/change-password', user_controller_1.default.changePassword);
router.put('/kyc/:id', (0, helpers_1.update)('User'));
router.put('/users/:id', (0, helpers_1.update)('User'));
exports.default = router;
