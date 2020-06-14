"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isID = void 0;
function isID(id) {
    return id.match(/([0-9])+/g) ? true : false;
}
exports.isID = isID;
