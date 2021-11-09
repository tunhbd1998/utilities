"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrlWithQuery = exports.removeQueryFromUrl = void 0;
const queryString = __importStar(require("query-string"));
const ramda_1 = require("ramda");
const removeQueryFromUrl = (url, queryFields = []) => {
    const parsedUrl = queryString.parseUrl(url);
    return queryString.stringifyUrl({
        url: parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.url,
        query: (0, ramda_1.omit)(queryFields, parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.query),
    });
};
exports.removeQueryFromUrl = removeQueryFromUrl;
const buildUrlWithQuery = (url, query = {}) => {
    return queryString.stringifyUrl({
        url,
        query,
    });
};
exports.buildUrlWithQuery = buildUrlWithQuery;
