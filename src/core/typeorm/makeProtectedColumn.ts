import { MakePropertyRequired } from '@utils/types';
import { ProtectedColumnOptions } from './types';
import { EntityEncryptionProtectedColumn, EntityPlainProtectedColumn } from '@column/entities';
import {
  DEFAULT_BINARY_DATA_TEXT_FORMAT,
  DEFAULT_ENCRYPTION_ALGORITHM,
  DEFAULT_ENCRYPTION_IV_LENGTH,
  DEFAULT_HASH_ALGORITHM,
} from './constants';

export const makeEntityPlainProtectedColumnInstance = (options: ProtectedColumnOptions) => {
  return new EntityPlainProtectedColumn({
    binaryTextFormat: options.binaryTextFormat ?? DEFAULT_BINARY_DATA_TEXT_FORMAT,
    hash: options.hash ?? {
      algorithm: DEFAULT_HASH_ALGORITHM,
    },
  });
};

export const makeEntityEncryptProtectedColumnInstance = (
  options: MakePropertyRequired<ProtectedColumnOptions, 'encrypt'>,
) => {
  const { encrypt } = options;
  return new EntityEncryptionProtectedColumn(encrypt, {
    binaryTextFormat: options.binaryTextFormat ?? DEFAULT_BINARY_DATA_TEXT_FORMAT,
    hash: options.hash ?? {
      algorithm: DEFAULT_HASH_ALGORITHM,
    },
    encrypt: {
      algorithm: encrypt?.algorithm ?? DEFAULT_ENCRYPTION_ALGORITHM,
      ivLength: encrypt?.ivLength ?? DEFAULT_ENCRYPTION_IV_LENGTH,
    },
  });
};
