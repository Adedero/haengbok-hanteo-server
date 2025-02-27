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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_model_1 = __importDefault(require("../../models/settings.model"));
const winston_config_1 = __importDefault(require("../../config/winston.config"));
const utils_1 = require("../../utils");
const mailer_1 = __importDefault(require("../../utils/mailer"));
const email_1 = require("../../templates/email");
const __1 = require("../..");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.render('pages/index');
});
router.get('/about', (req, res) => {
    res.render('pages/about');
});
router.get('/contact-us', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const settings = yield settings_model_1.default.findOne({}).lean();
        res.render('pages/contact', { contactAddress: (_a = settings === null || settings === void 0 ? void 0 : settings.contactAddress) !== null && _a !== void 0 ? _a : 'info@haengbokhanteo.com' });
    }
    catch (e) {
        winston_config_1.default.error(e);
        res.status(500).render('pages/server-error', Object.assign({}, (!__1.isProductionEnv && { error: e })));
    }
}));
router.post('/contact-us', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fullName, email, subject, message } = req.body;
        if (!fullName || !email || !message) {
            throw new Error('Missing fields found');
        }
        const error = yield (0, mailer_1.default)({
            to_email: (_a = process.env.EMAIL_USER) !== null && _a !== void 0 ? _a : 'info@haengbokhanteo.com',
            from_email: email.toString(),
            subject: subject === null || subject === void 0 ? void 0 : subject.toString(),
            html: (0, email_1.helpEmail)({
                name: fullName.toString(),
                email: email.toString(),
                message: message.toString(),
                subject: subject === null || subject === void 0 ? void 0 : subject.toString()
            })
        });
        if (error) {
            console.log(error);
            throw error;
        }
        res.render('pages/success');
    }
    catch (e) {
        winston_config_1.default.error(e);
        res.status(500).render('pages/server-error', Object.assign({}, (!__1.isProductionEnv && { error: e })));
    }
}));
router.get('/app-download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield settings_model_1.default.findOne({}).lean();
        if (!settings) {
            throw new Error('No settings found');
        }
        const currentLocale = res.locals.currentLocale || 'ko';
        const formattedDate = (0, utils_1.formatDate)(settings.appDetails.releaseDate, currentLocale);
        const updatedSettings = Object.assign(Object.assign({}, settings), { appDetails: Object.assign(Object.assign({}, settings.appDetails), { releaseDate: formattedDate }) });
        res.render('pages/app-download', { settings: updatedSettings });
    }
    catch (e) {
        winston_config_1.default.error(e);
        res.status(500).render('pages/server-error', { error: e });
    }
}));
exports.default = router;
