export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === void 0;
};

export const isJsonObject = (value: unknown): value is { [propName: string]: any } => {
  return !isNullOrUndefined(value) && typeof value === 'object';
};
