import { path } from "ramda";

export const convertFromArrayToObject = (
  arr: any[],
  keyFieldPath: (string | number)[],
  valGetterFunc?: (item: any) => any
) => {
  const result: { [property: string]: any } = {};

  for (const item of arr) {
    result[path(keyFieldPath, item) as string] =
      typeof valGetterFunc === "function" ? valGetterFunc(item) : item;
  }

  return result;
};
