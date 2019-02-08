export const removeEmptyKey = (object: any) => {
  Object.keys(object).forEach(k => {
    if (object[k] === undefined || object[k] === null) {
      delete object[k];
    }
  });
  return object;
};

export const isNullOrUndefined = (v: number | undefined | null) => {
  return v === undefined || v === null;
};
