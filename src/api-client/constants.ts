import { API_RESPONSE_CODE } from "./types";

export const standardServerResponse = (
  data: any,
  ErrorClass?: any,
  errorStatus?: string,
  errorMsg?: string
) => {
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

export const standardCeApiResponse = (
  statusCode: number,
  data: any,
  error: any = null
): {
  code: API_RESPONSE_CODE;
  data: any | { errorCode: number; errorStatus: string; errorMessage: string };
} => {
  if (statusCode === 200 || statusCode == 201) {
    return {
      code: API_RESPONSE_CODE.SUCCESS,
      data,
    };
  }

  if (error) {
    return {
      code: API_RESPONSE_CODE.ERROR,
      data: {
        errorCode:
          error?.response?.data?.error?.code || error?.response?.statusCode,
        errorStatus: error?.response?.data?.error?.status,
        errorMessage: error?.response?.data?.error?.message,
      },
    };
  }

  return {
    code: API_RESPONSE_CODE.EXCEPTION,
    data: null,
  };
};
