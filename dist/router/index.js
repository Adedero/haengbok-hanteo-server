"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useRouter;
const pages_router_1 = __importDefault(require("./routes/pages.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const api_router_1 = __importDefault(require("./routes/api.router"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
function useRouter(app) {
    app.use('/', pages_router_1.default);
    app.use('/auth', auth_router_1.default);
    app.use('/user', (0, authenticate_1.default)('USER'), user_router_1.default);
    app.use('/api', api_router_1.default);
}
