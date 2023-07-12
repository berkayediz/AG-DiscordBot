"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringUtil {
    static capitalize(text) {
        if (typeof text !== 'string')
            return '';
        return text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1);
    }
}
exports.default = StringUtil;
