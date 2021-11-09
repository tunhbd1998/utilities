import * as queryString from "query-string";
import { omit } from "ramda";

export const removeQueryFromUrl = (
  url: string,
  queryFields: string[] = []
): string => {
  const parsedUrl = queryString.parseUrl(url);

  return queryString.stringifyUrl({
    url: parsedUrl?.url,
    query: omit(queryFields, parsedUrl?.query),
  });
};

export const buildUrlWithQuery = (
  url: string,
  query: { [property: string]: string | number } = {}
): string => {
  return queryString.stringifyUrl({
    url,
    query,
  });
};
