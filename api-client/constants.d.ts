import { API_RESPONSE_CODE } from "./types";
export declare const standardServerResponse: (data: any, ErrorClass?: any, errorStatus?: string, errorMsg?: string) => any;
export declare const standardCeApiResponse: (statusCode: number, data: any, error?: any) => {
    code: API_RESPONSE_CODE;
    data: any | {
        errorCode: number;
        errorStatus: string;
        errorMessage: string;
    };
};
