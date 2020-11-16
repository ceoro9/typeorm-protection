import { ProtectedColumnOptions } from './types';
import {
  makePlainColumnProtection,
  makeEncryptedColumnProtection,
  makeTypedEncryptedColumnProtection,
  makeTypedPlainColumnProtection,
} from './column';

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

export const TypedPlainColumnProtection = (options: ProtectedColumnOptions) => {
  return makeTypedPlainColumnProtection(options);
};

export const TypedEncryptedColumnProtection = (options: ProtectedColumnOptions) => {
  const { encrypt } = options;

  if (!encrypt) {
    return makeTypedPlainColumnProtection(options);
  }

  return makeTypedEncryptedColumnProtection({ ...options, encrypt });
};
