"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../../controllers/auth/auth.controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.default.register);
router.post('/login', auth_controller_1.default.login);
router.post('/login/automatic', auth_controller_1.default.automaticLogin);
router.get('/account/confirm', auth_controller_1.default.confirmAccount);
router.post('/account/otp', auth_controller_1.default.sendOtp);
router.post('/account/verify', auth_controller_1.default.verifyOtp);
router.post('/account/set-password', auth_controller_1.default.setPassword);
router.put('/account/reset-password', auth_controller_1.default.resetPassword);
/* router.post('/login/:email?', AuthController.login)

router.post(
  '/account/verification-email/:id/:email',
  AuthController.sendVerificationMail
)
router.post('/account/change-email/:id/:email', AuthController.changeEmail)
router.post('/account/verify', AuthController.verifyAccount)
router.post('/account/pin-setup/:id', AuthController.pinSetup) */
exports.default = router;
