export const excludeUndefinedFields = (fields: any): any => {
  if (typeof fields !== "object") {
    return fields;
  }

  if (fields instanceof Array) {
    return fields;
  }

  const ret: { [property: string]: any } = {};
  for (const field in fields) {
    if (typeof fields[field] === "undefined") {
      continue;
    }

    ret[field] =
      typeof fields[field] === "object" && !(fields[field] instanceof Array)
        ? excludeUndefinedFields(fields[field])
        : fields[field];
  }

  return ret;
};
