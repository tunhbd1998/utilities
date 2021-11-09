"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromArrayToObject = void 0;
const ramda_1 = require("ramda");
const convertFromArrayToObject = (arr, keyFieldPath, valGetterFunc) => {
    const result = {};
    for (const item of arr) {
        result[(0, ramda_1.path)(keyFieldPath, item)] =
            typeof valGetterFunc === "function" ? valGetterFunc(item) : item;
    }
    return result;
};
exports.convertFromArrayToObject = convertFromArrayToObject;
