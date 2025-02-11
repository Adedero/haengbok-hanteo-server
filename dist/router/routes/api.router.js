"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_controller_1 = __importDefault(require("../../controllers/api/api.controller"));
const express_1 = require("express");
const helpers_1 = require("./../../controllers/api/services/helpers");
const router = (0, express_1.Router)();
router.post('/contact', api_controller_1.default.contactCustomerCare);
//Admin routes
router.route('/transactions')
    .get((0, helpers_1.getAll)('Transaction'))
    .post((0, helpers_1.create)('Transaction'));
router.route('/transactions/:id')
    .get((0, helpers_1.getById)('Transaction'))
    .put((0, helpers_1.update)('Transaction'))
    .delete((0, helpers_1.deleteOne)('Transaction'));
router.get('/transactions-count', (0, helpers_1.count)('Transaction'));
router.route('/properties')
    .get((0, helpers_1.getAll)('Property'))
    .post(api_controller_1.default.createProperty);
router.route('/properties/:id')
    .get((0, helpers_1.getById)('Property'))
    .put((0, helpers_1.update)('Property'))
    .delete(api_controller_1.default.deleteProperty);
//.delete(deleteOne('Property' as 'User'))
router.get('/properties-count', (0, helpers_1.count)('Property'));
router.get('/users', (0, helpers_1.getAll)('User'));
router.get('/users-count', (0, helpers_1.count)('User'));
router.route('/users/:id')
    .get((0, helpers_1.getById)('User'))
    .put((0, helpers_1.update)('User'));
router.put('/user-password-reset/:id', api_controller_1.default.resetUserPassword);
router.put('/settings', helpers_1.updateSettings);
router.get('/admin-dashboard', api_controller_1.default.getAdminDashboard);
exports.default = router;
