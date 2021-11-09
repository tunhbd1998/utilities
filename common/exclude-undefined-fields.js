"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeUndefinedFields = void 0;
const excludeUndefinedFields = (fields) => {
    if (typeof fields !== "object") {
        return fields;
    }
    if (fields instanceof Array) {
        return fields;
    }
    const ret = {};
    for (const field in fields) {
        if (typeof fields[field] === "undefined") {
            continue;
        }
        ret[field] =
            typeof fields[field] === "object" && !(fields[field] instanceof Array)
                ? (0, exports.excludeUndefinedFields)(fields[field])
                : fields[field];
    }
    return ret;
};
exports.excludeUndefinedFields = excludeUndefinedFields;
