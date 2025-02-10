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
exports.isProductionEnv = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cors_config_1 = require("./config/cors.config");
require("./database");
const router_1 = __importDefault(require("./router"));
const winston_config_1 = __importDefault(require("./config/winston.config"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const node_path_1 = __importDefault(require("node:path"));
const i18n_1 = __importDefault(require("./i18n"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./database");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
exports.isProductionEnv = process.env.NODE_ENV === 'production';
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('MongoDB connected successfully');
})
    .catch((error) => {
    if (exports.isProductionEnv)
        winston_config_1.default.error(error.message);
    else
        console.error(error);
    process.exit(1);
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log('Database connection closed due to app termination');
    process.exit(0);
}));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3300;
app.set('trust proxy', 1);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(cors_config_1.corsOptions));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, serve_favicon_1.default)(node_path_1.default.resolve('public', 'favicon.ico')));
app.use('/primeicons', express_1.default.static(node_path_1.default.resolve('node_modules', 'primeicons')));
app.use((0, helmet_1.default)());
app.use(i18n_1.default.init);
app.use((req, res, next) => {
    res.locals.__ = res.__;
    res.locals.currentLocale = req.getLocale();
    const lang = req.query.lang || req.cookies.locale || "ko";
    res.cookie("locale", lang, {
        maxAge: 900000,
        httpOnly: true,
        secure: exports.isProductionEnv, // Only use secure cookies in production
        sameSite: exports.isProductionEnv ? 'none' : 'lax' // None for cross-site, Lax for normal use
    });
    req.setLocale(lang);
    next();
});
app.set('view engine', 'ejs');
app.set('views', node_path_1.default.resolve('src/views'));
(0, router_1.default)(app);
app.post('/listings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listings = req.body.data;
    if (!listings) {
        res.status(400).json({ message: 'No Data Provided', success: false });
        return;
    }
    const data = yield database_1.db.Listing.insertMany(listings);
    res.status(200).json({ message: 'Successful', data, success: true });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res, next) => {
    res.status(404).render("pages/not-found");
});
app.listen(PORT, () => {
    if (!exports.isProductionEnv) {
        console.log(`Server running on http://localhost:${PORT}`);
    }
    else {
        winston_config_1.default.info(`Server running on port ${PORT}`);
    }
});
