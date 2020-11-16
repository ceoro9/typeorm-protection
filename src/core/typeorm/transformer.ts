import { isJsonObject, isNullOrUndefined } from '@utils/value';
import { BaseEntityProtectedColumn } from '@column/entities';
import { TypedProtectedColumn } from './typedProtectedColumn';

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

export const makeTypedProtectedColumnTransformer = (
  entityProtectedColumnEncoder: BaseEntityProtectedColumn,
  entityProtectedColumnDecoders: BaseEntityProtectedColumn[],
) => {
  return {
    to: (input: any) => {
      if (input instanceof TypedProtectedColumn) {
        try {
          return input.getFromDataIfExists();
        } catch (e) {
          const value = input.getValue();

          if (!value) {
            return value;
          }

          return entityProtectedColumnEncoder.protectTo(value);
        }
      }

      throw new Error('Invalid input to serialize for protection');
    },
    from: (input: any) => {
      if (isNullOrUndefined(input)) {
        return TypedProtectedColumn.from(input, () => input);
      }

      if (isJsonObject(input)) {
        const protectedColumnType = entityProtectedColumnEncoder.getSerializedProtectedColumnType(input);
        const entityProtectedColumnDecoder = [entityProtectedColumnEncoder, ...entityProtectedColumnDecoders].find(
          (decoder: BaseEntityProtectedColumn) => decoder.getProtectedColumnType() === protectedColumnType,
        );

        if (!entityProtectedColumnDecoder) {
          throw new Error(`Cannot decode type '${protectedColumnType}'`);
        }

        const decoder = entityProtectedColumnDecoder.protectFrom.bind(entityProtectedColumnDecoder);
        return TypedProtectedColumn.from(input, decoder);
      }

      throw new Error('Invalid input to deserialize from protection');
    },
  };
};
