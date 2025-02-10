"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponse = void 0;
const useResponse = (res, status, message) => {
    let data = {};
    if (!message)
        data.message = "And we're working on it.\nPlease, try again later.";
    else if (typeof message === 'string')
        data.message = message;
    else
        data = message;
    res.status(status).json(data);
};
exports.useResponse = useResponse;
