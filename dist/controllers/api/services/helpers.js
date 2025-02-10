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
exports.deleteAll = exports.deleteOne = exports.updateSettings = exports.update = exports.create = exports.getById = exports.countAndGetAll = exports.count = exports.getAll = void 0;
const utils_1 = require("../../../utils");
const constants_1 = require("../../../utils/constants");
const database_1 = require("../../../database");
const use_response_1 = require("../../../utils/use-response");
const getAll = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { skip, limit } = (0, utils_1.parseSkipAndLimit)(req, constants_1.GLOBAL_API_LIMIT);
        const { sort } = req.query;
        let sortObject = {};
        if (sort && typeof sort === 'string') {
            const [field, order] = sort.split(',');
            sortObject = { [field]: order === 'asc' ? 1 : -1 };
        }
        try {
            const data = yield database_1.db[model].find().skip(skip).limit(limit).sort(sortObject).lean();
            (0, use_response_1.useResponse)(res, 200, { items: data });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.getAll = getAll;
const count = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const count = yield database_1.db[model].estimatedDocumentCount();
            (0, use_response_1.useResponse)(res, 200, { count });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.count = count;
const countAndGetAll = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { skip, limit } = (0, utils_1.parseSkipAndLimit)(req, constants_1.GLOBAL_API_LIMIT);
        const { sort } = req.query;
        let sortObject = {};
        if (sort && typeof sort === 'string') {
            const [field, order] = sort.split(',');
            sortObject = { [field]: order === 'asc' ? 1 : -1 };
        }
        try {
            const [data, count] = yield Promise.all([
                database_1.db[model].find().skip(skip).limit(limit).sort(sortObject).lean(),
                database_1.db[model].estimatedDocumentCount()
            ]);
            (0, use_response_1.useResponse)(res, 200, { items: data, count });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.countAndGetAll = countAndGetAll;
const getById = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id) {
            (0, use_response_1.useResponse)(res, 400, 'Property ID is required');
            return;
        }
        try {
            const data = yield database_1.db[model].findById(id).lean();
            if (!data) {
                (0, use_response_1.useResponse)(res, 404, `${model} not found`);
                return;
            }
            (0, use_response_1.useResponse)(res, 200, data);
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.getById = getById;
const create = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        if (!data) {
            (0, use_response_1.useResponse)(res, 400, 'No data was provided');
            return;
        }
        try {
            const item = new database_1.db[model](data);
            yield item.save();
            (0, use_response_1.useResponse)(res, 200, { item });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.create = create;
const update = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const data = req.body;
        if (!id) {
            (0, use_response_1.useResponse)(res, 400, 'Property ID is required');
            return;
        }
        if (!data) {
            (0, use_response_1.useResponse)(res, 400, 'No data was provided');
            return;
        }
        delete data.createdAt;
        delete data.updatedAt;
        delete data.__v;
        try {
            const item = yield database_1.db[model].findByIdAndUpdate(id, data, { new: true });
            if (!item) {
                (0, use_response_1.useResponse)(res, 404, `${model} not found`);
                return;
            }
            (0, use_response_1.useResponse)(res, 200, { message: `${model} updated`, item });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.update = update;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data) {
        (0, use_response_1.useResponse)(res, 400, 'No data was provided');
        return;
    }
    delete data.createdAt;
    delete data.updatedAt;
    delete data.__v;
    try {
        const settings = yield database_1.db.Settings.findOneAndUpdate({}, data, { new: true });
        (0, use_response_1.useResponse)(res, 200, { settings });
        return;
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.updateSettings = updateSettings;
const deleteOne = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id) {
            (0, use_response_1.useResponse)(res, 400, 'Property ID is required');
            return;
        }
        try {
            const property = yield database_1.db[model].findByIdAndDelete(id);
            if (!property) {
                (0, use_response_1.useResponse)(res, 404, 'Property not found');
                return;
            }
            (0, use_response_1.useResponse)(res, 200, 'Property deleted');
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.deleteOne = deleteOne;
const deleteAll = (model) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield database_1.db[model].deleteMany({});
            (0, use_response_1.useResponse)(res, 200, 'All properties deleted');
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
};
exports.deleteAll = deleteAll;
