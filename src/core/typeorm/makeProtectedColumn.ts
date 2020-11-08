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
    hash: makeHashProtection(options.hash),
  });
};

export const makeEntityEncryptProtectedColumnInstance = (
  options: MakePropertyRequired<ProtectedColumnOptions, 'encrypt'>,
) => {
  return new EntityEncryptionProtectedColumn(options.encrypt, {
    binaryTextFormat: options.binaryTextFormat ?? DEFAULT_BINARY_DATA_TEXT_FORMAT,
    hash: makeHashProtection(options.hash),
    encrypt: makeEncryptProtection(options.encrypt),
  });
};

const makeHashProtection = (hashOptions: ProtectedColumnOptions['hash']) => {
  return hashOptions
    ? {
        algorithm: hashOptions?.algorithm ?? DEFAULT_HASH_ALGORITHM,
      }
    : void 0;
};

const makeEncryptProtection = (encryptOptions: NonNullable<ProtectedColumnOptions['encrypt']>) => {
  return {
    algorithm: encryptOptions?.algorithm ?? DEFAULT_ENCRYPTION_ALGORITHM,
    ivLength: encryptOptions?.ivLength ?? DEFAULT_ENCRYPTION_IV_LENGTH,
  };
};
