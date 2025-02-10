"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("i18n"));
const node_path_1 = __importDefault(require("node:path"));
i18n_1.default.configure({
    locales: ["en", "ko"],
    defaultLocale: "ko",
    directory: node_path_1.default.resolve("locales"),
    queryParameter: "lang", // Allows ?lang=fr
    cookie: "locale", // Saves user preference in a cookie
    autoReload: true, // Reload translations automatically
    syncFiles: true, // Sync changes
    register: global, // Allow global `__()` function
    objectNotation: true
});
exports.default = i18n_1.default;
