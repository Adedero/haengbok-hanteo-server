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
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitKyc = submitKyc;
const use_response_1 = require("../../../utils/use-response");
function submitKyc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        if (!data) {
            (0, use_response_1.useResponse)(res, 400, 'Please upload a valid ID');
        }
        try {
        }
        catch (_a) {
        }
    });
}
