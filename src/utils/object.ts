import { Json } from './types';

export const getStrictStringFromJson = (obj: Json, propertyName: string) => {
  const result = getStrictFromJson(obj, propertyName);
  if (typeof result !== 'string') {
    throw new Error(`property '${propertyName}' is expected to be string`);
  }
  return result;
};

export const getStrictFromJson = (obj: Json, propertyName: string) => {
  const result = obj[propertyName];
  if (!result) {
    throw new Error(`No required property '${propertyName}'`);
  }
  return result;
};
