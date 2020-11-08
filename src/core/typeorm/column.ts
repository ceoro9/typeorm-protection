import { Column } from 'typeorm';
import { MakePropertyRequired } from '@utils/types';
import { ProtectedColumnOptions } from './types';
import { makeProtectedColumnTransformer } from './transformer';
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
