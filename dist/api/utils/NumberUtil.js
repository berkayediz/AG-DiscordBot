"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberUtil {
    static isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}
exports.default = NumberUtil;
