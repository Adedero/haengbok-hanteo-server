"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_config_1 = __importDefault(require("../config/passport.config"));
const authenticate = (role) => {
    const fn = (req, res, next) => {
        passport_config_1.default.authenticate('jwt', (err, user) => {
            if (err) {
                res.status(401).json({ message: err.message });
                return;
            }
            if (!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            if (!user.verified) {
                res.status(403).json({ message: 'Account not verified' });
                return;
            }
            if (role) {
                if (user.role !== role) {
                    res.status(403).json({ message: 'Not allowd' });
                    return;
                }
            }
            req.user = Object.assign({}, user);
            next();
        })(req, res, next);
    };
    return fn;
};
exports.default = authenticate;
