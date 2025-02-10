"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.corsOptions = {
    origin: "*"
};
