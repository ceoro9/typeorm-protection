import { Column } from 'typeorm';
import { MakePropertyRequired } from '@utils/types';
import { ProtectedColumnOptions } from './types';
import { makeProtectedColumnTransformer, makeTypedProtectedColumnTransformer } from './transformer';
import {
  makeEntityEncryptProtectedColumnInstance,
  makeEntityPlainProtectedColumnInstance,
} from './makeProtectedColumn';

export const makePlainColumnProtection = (options: ProtectedColumnOptions) => {
  return Column({
    type: 'json',
    nullable: true,
    transformer: makeProtectedColumnTransformer(makeEntityPlainProtectedColumnInstance(options), []),
  });
};

export const makeEncryptedColumnProtection = (options: MakePropertyRequired<ProtectedColumnOptions, 'encrypt'>) => {
  return Column({
    type: 'json',
    nullable: true,
    transformer: makeProtectedColumnTransformer(makeEntityEncryptProtectedColumnInstance(options), [
      makeEntityPlainProtectedColumnInstance(options),
    ]),
  });
};

export const makeTypedPlainColumnProtection = (options: ProtectedColumnOptions) => {
  return Column({
    type: 'json',
    nullable: true,
    transformer: makeTypedProtectedColumnTransformer(makeEntityPlainProtectedColumnInstance(options), []),
  });
};

export const makeTypedEncryptedColumnProtection = (
  options: MakePropertyRequired<ProtectedColumnOptions, 'encrypt'>,
) => {
  return Column({
    type: 'json',
    nullable: true,
    transformer: makeTypedProtectedColumnTransformer(makeEntityEncryptProtectedColumnInstance(options), [
      makeEntityPlainProtectedColumnInstance(options),
    ]),
  });
};
