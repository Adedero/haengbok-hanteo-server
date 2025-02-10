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
exports.default = createProperty;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
function createProperty(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listing = yield database_1.db.Listing.findOne({ deleted: false }).lean();
            if (!listing) {
                (0, use_response_1.useResponse)(res, 400, 'No properties to add. Try again later');
                return;
            }
            const property = new database_1.db.Property(listing);
            yield Promise.all([
                property.save(),
                database_1.db.Listing.updateOne({ _id: listing._id }, { deleted: true }),
            ]);
            (0, use_response_1.useResponse)(res, 200, { property });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
}
