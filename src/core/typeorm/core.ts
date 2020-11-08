import { ProtectedColumnOptions } from './types';
import { makePlainColumnProtection, makeEncryptedColumnProtection } from './column';

export const PlainColumnProtection = (options: ProtectedColumnOptions) => {
  return makePlainColumnProtection(options);
};

export const EncryptedColumnProtection = (options: ProtectedColumnOptions) => {
  const { encrypt } = options;

  if (!encrypt) {
    return makePlainColumnProtection(options);
  }

  return makeEncryptedColumnProtection({ ...options, encrypt });
};
