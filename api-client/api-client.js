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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const queryString = __importStar(require("query-string"));
const ramda_1 = require("ramda");
const urlJoin = require("url-join");
class ApiClient {
    constructor(options) {
        this._host = options.host;
        this._builtInHeaders = Object.assign({ "Content-Type": "application/json" }, ((options === null || options === void 0 ? void 0 : options.builtInHeaders) || {}));
        this._log = (options === null || options === void 0 ? void 0 : options.log) || false;
    }
    _buildHeaders(extraHeaders = {}) {
        return Object.assign(Object.assign({}, (this._builtInHeaders || {})), (extraHeaders || {}));
    }
    changeHost(host) {
        this._host = host;
    }
    changeBuiltInHeader(property, value) {
        property && (this._builtInHeaders[property] = value);
    }
    configureBearerAuthorization(token) {
        this._builtInHeaders["Authorization"] = `Bearer ${token}`;
    }
    _buildApi(url, query = {}) {
        const api = urlJoin(...(this._host ? [this._host] : []), url, (0, ramda_1.isEmpty)(query) ? "" : `?${queryString.stringify(query)}`);
        if (this._log) {
            console.log("Request API: ", api);
        }
        return api;
    }
    wrapResponse(caller) {
        return caller
            .then(({ status, data }) => ({
            success: true,
            data,
        }))
            .catch((err) => {
            var _a, _b;
            return ({
                success: false,
                data: null,
                error: {
                    statusCode: (_a = err === null || err === void 0 ? void 0 : err.respose) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data,
                },
            });
        });
    }
    asyncGet(url, query, extraOptions) {
        return axios_1.default.get(this._buildApi(url, query), Object.assign(Object.assign({}, (extraOptions || {})), { headers: this._buildHeaders(extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.headers) }));
    }
    asyncPost(url, data, extraOptions) {
        return axios_1.default.post(this._buildApi(url, {}), data || {}, Object.assign(Object.assign({}, (extraOptions || {})), { headers: this._buildHeaders(extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.headers) }));
    }
    asyncPut(url, data, extraOptions) {
        return axios_1.default.put(this._buildApi(url, {}), data || {}, Object.assign(Object.assign({}, (extraOptions || {})), { headers: this._buildHeaders(extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.headers) }));
    }
    asyncPatch(url, data, extraOptions) {
        return axios_1.default.patch(this._buildApi(url, {}), data || {}, Object.assign(Object.assign({}, (extraOptions || {})), { headers: this._buildHeaders(extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.headers) }));
    }
    asyncDelete(url, extraOptions) {
        return axios_1.default.delete(this._buildApi(url), Object.assign(Object.assign({}, (extraOptions || {})), { headers: this._buildHeaders(extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.headers) }));
    }
}
exports.ApiClient = ApiClient;
