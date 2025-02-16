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
exports.txnEmitter = void 0;
const node_events_1 = require("node:events");
const winston_config_1 = __importDefault(require("../config/winston.config"));
const transaction_service_1 = require("../controllers/api/services/transaction.service");
class TransactionEmitter extends node_events_1.EventEmitter {
}
exports.txnEmitter = new TransactionEmitter();
exports.txnEmitter.on('error', (err) => {
    winston_config_1.default.error(`Transaction Emitter Error: ${err.message}`, err);
});
exports.txnEmitter.on('created', (txn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, transaction_service_1.sendTransactionNotifications)(txn);
    }
    catch (error) {
        const err = error;
        winston_config_1.default.error(`Error sending transaction notifications: ${err.message}`, err);
    }
}));
