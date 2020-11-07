import { Json } from '@utils/types';
import { getStrictStringFromJson } from '@utils/object';
import { ProtectedColumn, ProtectedColumnTypes, SerializationOptions } from './types';
import {
  CIPHERED_SLAVE_KEY_PROP_NAME,
  PROTECTION_TYPE_PROP_NAME,
  CIPHER_ALGORITHM_PROP_NAME,
  MASTER_KEY_ID_PROP_NAME,
  PROTECTED_DATA_PROP_NAME,
  HASH_ALGORITHM_PROP_NAME,
  HASHED_PROTECTED_DATA_PROP_NAME,
  IV_PROP_NAME,
} from './constants';

export const serializeProtectedColumnDataObject = (payload: ProtectedColumn, options: SerializationOptions) => {
  const { binaryTextFormat } = options;

  const { hash } = payload;
  const baseData = {
    [HASH_ALGORITHM_PROP_NAME]: hash?.algorithm,
    [HASHED_PROTECTED_DATA_PROP_NAME]: hash?.data.toString(binaryTextFormat),
  };

  if (payload.type === ProtectedColumnTypes.ENCRYPTED) {
    const { encrypt } = payload;
    return {
      ...baseData,
      [PROTECTION_TYPE_PROP_NAME]: payload.type,
      [CIPHER_ALGORITHM_PROP_NAME]: encrypt.algorithm,
      [MASTER_KEY_ID_PROP_NAME]: encrypt.masterKeyId,
      [CIPHERED_SLAVE_KEY_PROP_NAME]: encrypt.cipheredSlaveKey.toString(binaryTextFormat),
      [PROTECTED_DATA_PROP_NAME]: encrypt.data.toString(binaryTextFormat),
      [IV_PROP_NAME]: encrypt.iv.toString(binaryTextFormat),
    };
  }

  return {
    ...baseData,
    [PROTECTION_TYPE_PROP_NAME]: payload.type,
    [PROTECTED_DATA_PROP_NAME]: payload.plain.data,
  };
};

export const deserializeProtectedColumnDataObject = (payload: Json, options: SerializationOptions): ProtectedColumn => {
  const { binaryTextFormat } = options;
  const columnType = getStrictStringFromJson(payload, PROTECTION_TYPE_PROP_NAME);

  const baseData = {
    hash: {
      algorithm: getStrictStringFromJson(payload, HASH_ALGORITHM_PROP_NAME),
      data: Buffer.from(getStrictStringFromJson(payload, HASHED_PROTECTED_DATA_PROP_NAME), binaryTextFormat),
    },
  };

  if (columnType === ProtectedColumnTypes.ENCRYPTED) {
    return {
      ...baseData,
      type: ProtectedColumnTypes.ENCRYPTED,
      encrypt: {
        algorithm: getStrictStringFromJson(payload, CIPHER_ALGORITHM_PROP_NAME),
        data: Buffer.from(getStrictStringFromJson(payload, PROTECTED_DATA_PROP_NAME), binaryTextFormat),
        iv: Buffer.from(getStrictStringFromJson(payload, IV_PROP_NAME), binaryTextFormat),
        cipheredSlaveKey: Buffer.from(getStrictStringFromJson(payload, CIPHERED_SLAVE_KEY_PROP_NAME), binaryTextFormat),
        masterKeyId: getStrictStringFromJson(payload, MASTER_KEY_ID_PROP_NAME),
      },
    };
  }

  return {
    ...baseData,
    type: ProtectedColumnTypes.PLAIN,
    plain: {
      data: getStrictStringFromJson(payload, PROTECTED_DATA_PROP_NAME),
    },
  };
};
