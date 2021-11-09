export const convertFromObjectToArray = (
  obj: {
    [field: string]: any;
  },
  valGetterFunc?: (key: string, value: any) => any
): any[] => {
  const arr = [];

  for (const field in obj) {
    arr.push(
      typeof valGetterFunc === "function"
        ? valGetterFunc(field, obj[field])
        : obj[field]
    );
  }

  return arr;
};
