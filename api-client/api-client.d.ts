import { ApiClientOptions, ApiClientRequestData, ApiClientRequestOptions, ApiClientRequestQuery, ApiClientResponseWrapper } from "./types";
export declare class ApiClient {
    private _builtInHeaders;
    private _host;
    private _log;
    constructor(options: ApiClientOptions);
    private _buildHeaders;
    changeHost(host: string): void;
    changeBuiltInHeader(property: string, value: any): void;
    configureBearerAuthorization(token: string): void;
    private _buildApi;
    wrapResponse<T>(caller: Promise<any>): Promise<ApiClientResponseWrapper<T>>;
    asyncGet(url: string, query?: ApiClientRequestQuery, extraOptions?: ApiClientRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    asyncPost(url: string, data?: ApiClientRequestData, extraOptions?: ApiClientRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    asyncPut(url: string, data?: ApiClientRequestData, extraOptions?: ApiClientRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    asyncPatch(url: string, data?: ApiClientRequestData, extraOptions?: ApiClientRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    asyncDelete(url: string, extraOptions?: ApiClientRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
}
