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
exports.default = deleteProperty;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
function deleteProperty(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Delete the property
            //Bring back the listing
            const { id } = req.params;
            if (!id) {
                (0, use_response_1.useResponse)(res, 400, 'Property ID is required');
                return;
            }
            const property = yield database_1.db.Property.findById(id).lean();
            if (!property) {
                (0, use_response_1.useResponse)(res, 400, 'Property not found');
                return;
            }
            yield Promise.all([
                database_1.db.Property.deleteOne({ _id: property._id }),
                database_1.db.Listing.updateOne({ name: property.name }, { deleted: false })
            ]);
            (0, use_response_1.useResponse)(res, 200, { property });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
}
