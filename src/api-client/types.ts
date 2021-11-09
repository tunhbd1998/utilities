export enum API_CLIENT_REQUEST_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum API_RESPONSE_CODE {
  SUCCESS = 0,
  FAILED = 1,
  ERROR = 2,
  EXCEPTION = 3,
}

export type ApiClientOptions = {
  host: string;
  builtInHeaders?: { [property: string]: any };
  log?: boolean;
};

export type ApiClientHeaders = {
  contentType?: string;
  [property: string]: any;
};

export type ApiClientRequestOptions = {
  headers: ApiClientHeaders;
  [property: string]: any;
};

export type ApiClientRequestQuery = {
  [property: string]: string | number;
};

export type ApiClientRequestData = {
  [property: string]: any;
};

export type ApiClientResponseWrapper<T> = {
  success: boolean;
  data?: T;
  error?: {
    statusCode?: 400 | 401 | 403 | 500;
    data?: any;
  };
};
