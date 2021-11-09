"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromObjectToArray = void 0;
const convertFromObjectToArray = (obj, valGetterFunc) => {
    const arr = [];
    for (const field in obj) {
        arr.push(typeof valGetterFunc === "function"
            ? valGetterFunc(field, obj[field])
            : obj[field]);
    }
    return arr;
};
exports.convertFromObjectToArray = convertFromObjectToArray;
