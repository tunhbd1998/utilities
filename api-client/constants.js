"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardCeApiResponse = exports.standardServerResponse = void 0;
const types_1 = require("./types");
const standardServerResponse = (data, ErrorClass, errorStatus, errorMsg) => {
    if (ErrorClass) {
        throw new ErrorClass({
            error: {
                status: errorStatus,
                message: errorMsg,
            },
        });
        return;
    }
    return data;
};
exports.standardServerResponse = standardServerResponse;
const standardCeApiResponse = (statusCode, data, error = null) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (statusCode === 200 || statusCode == 201) {
        return {
            code: types_1.API_RESPONSE_CODE.SUCCESS,
            data,
        };
    }
    if (error) {
        return {
            code: types_1.API_RESPONSE_CODE.ERROR,
            data: {
                errorCode: ((_c = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.code) || ((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.statusCode),
                errorStatus: (_g = (_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.error) === null || _g === void 0 ? void 0 : _g.status,
                errorMessage: (_k = (_j = (_h = error === null || error === void 0 ? void 0 : error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.error) === null || _k === void 0 ? void 0 : _k.message,
            },
        };
    }
    return {
        code: types_1.API_RESPONSE_CODE.EXCEPTION,
        data: null,
    };
};
exports.standardCeApiResponse = standardCeApiResponse;
