"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_dashboard_1 = __importDefault(require("./services/admin-dashboard"));
const contact_1 = __importDefault(require("./services/contact"));
const create_property_1 = __importDefault(require("./services/create-property"));
const delete_property_1 = __importDefault(require("./services/delete-property"));
const reset_password_1 = __importDefault(require("./services/reset-password"));
const ApiController = {
    createProperty: create_property_1.default,
    contactCustomerCare: contact_1.default,
    getAdminDashboard: admin_dashboard_1.default,
    resetUserPassword: reset_password_1.default,
    deleteProperty: delete_property_1.default
};
exports.default = ApiController;
