import axios from "axios";
import * as queryString from "query-string";
import { isEmpty } from "ramda";
import {
  ApiClientHeaders,
  ApiClientOptions,
  ApiClientRequestData,
  ApiClientRequestOptions,
  ApiClientRequestQuery,
  ApiClientResponseWrapper,
} from "./types";

const urlJoin = require("url-join");

export class ApiClient {
  private _builtInHeaders: { [property: string]: any };
  private _host: string;
  private _log: boolean;

  constructor(options: ApiClientOptions) {
    this._host = options.host;
    this._builtInHeaders = {
      "Content-Type": "application/json",
      ...(options?.builtInHeaders || {}),
    };
    this._log = options?.log || false;
  }

  private _buildHeaders(extraHeaders: ApiClientHeaders = {}) {
    return {
      ...(this._builtInHeaders || {}),
      ...(extraHeaders || {}),
    };
  }

  changeHost(host: string) {
    this._host = host;
  }

  changeBuiltInHeader(property: string, value: any) {
    property && (this._builtInHeaders[property] = value);
  }

  configureBearerAuthorization(token: string) {
    this._builtInHeaders["Authorization"] = `Bearer ${token}`;
  }

  private _buildApi(url: string, query: ApiClientRequestQuery = {}) {
    const api = urlJoin(
      ...(this._host ? [this._host] : []),
      url,
      isEmpty(query) ? "" : `?${queryString.stringify(query)}`
    );

    if (this._log) {
      console.log("Request API: ", api);
    }

    return api;
  }

  wrapResponse<T>(caller: Promise<any>): Promise<ApiClientResponseWrapper<T>> {
    return caller
      .then(({ status, data }) => ({
        success: true,
        data,
      }))
      .catch((err) => ({
        success: false,
        data: null,
        error: {
          statusCode: err?.respose?.status,
          data: err?.response?.data,
        },
      }));
  }

  asyncGet(
    url: string,
    query?: ApiClientRequestQuery,
    extraOptions?: ApiClientRequestOptions
  ) {
    return axios.get(this._buildApi(url, query), {
      ...(extraOptions || {}),
      headers: this._buildHeaders(extraOptions?.headers),
    });
  }

  asyncPost(
    url: string,
    data?: ApiClientRequestData,
    extraOptions?: ApiClientRequestOptions
  ) {
    return axios.post(this._buildApi(url, {}), data || {}, {
      ...(extraOptions || {}),
      headers: this._buildHeaders(extraOptions?.headers),
    });
  }

  asyncPut(
    url: string,
    data?: ApiClientRequestData,
    extraOptions?: ApiClientRequestOptions
  ) {
    return axios.put(this._buildApi(url, {}), data || {}, {
      ...(extraOptions || {}),
      headers: this._buildHeaders(extraOptions?.headers),
    });
  }

  asyncPatch(
    url: string,
    data?: ApiClientRequestData,
    extraOptions?: ApiClientRequestOptions
  ) {
    return axios.patch(this._buildApi(url, {}), data || {}, {
      ...(extraOptions || {}),
      headers: this._buildHeaders(extraOptions?.headers),
    });
  }

  asyncDelete(url: string, extraOptions?: ApiClientRequestOptions) {
    return axios.delete(this._buildApi(url), {
      ...(extraOptions || {}),
      headers: this._buildHeaders(extraOptions?.headers),
    });
  }

  // asyncAll(
  //   requests: {
  //     method: API_CLIENT_REQUEST_METHOD;
  //     url: string;
  //     query?: ApiClientRequestQuery;
  //     data?: ApiClientRequestData;
  //     extraOptions?: ApiClientRequestOptions;
  //   }[] = []
  // ) {
  //   return axios
  //     .all(
  //       requests.map((req) => {
  //         switch (req.method) {
  //           case API_CLIENT_REQUEST_METHOD.GET:
  //             return this.asyncGet(req.url, req?.query, req?.extraOptions);
  //           case API_CLIENT_REQUEST_METHOD.GET:
  //             return this.asyncPost(req.url, req?.data, req?.extraOptions);
  //         }

  //         return null;
  //       })
  //     )
  //     .then(
  //       axios.spread((...responses) =>
  //         responses.map((res) => res?.data || null)
  //       )
  //     );
  // }
}
