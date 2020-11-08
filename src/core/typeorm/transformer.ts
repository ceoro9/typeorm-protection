import { isJsonObject, isNullOrUndefined } from '@utils/value';
import { BaseEntityProtectedColumn } from '@column/entities';

export const makeProtectedColumnTransformer = (
  entityProtectedColumnEncoder: BaseEntityProtectedColumn,
  entityProtectedColumnDecoders: BaseEntityProtectedColumn[],
) => {
  return {
    to: (value: any) => {
      if (isNullOrUndefined(value)) {
        return null;
      }

      if (typeof value === 'string') {
        return entityProtectedColumnEncoder.protectTo(value);
      }

      throw new Error(`Invalid value to serialize for protection. Should be Buffer, null or undefined`);
    },
    from: (value: any) => {
      if (isNullOrUndefined(value)) {
        return null;
      }

      if (isJsonObject(value)) {
        const protectedColumnType = entityProtectedColumnEncoder.getSerializedProtectedColumnType(value);
        const entityProtectedColumnDecoder = [entityProtectedColumnEncoder, ...entityProtectedColumnDecoders].find(
          (decoder: BaseEntityProtectedColumn) => decoder.getProtectedColumnType() === protectedColumnType,
        );

        if (!entityProtectedColumnDecoder) {
          throw new Error(`Cannot decode type '${protectedColumnType}'`);
        }

        return entityProtectedColumnDecoder.protectFrom(value);
      }

      throw new Error(`Invalid value to deserialize from protection. Should be json-like object, null or undefined`);
    },
  };
};
