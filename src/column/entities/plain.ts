import { BaseProtectedColumnOptions, ProtectedColumnTypes } from '@column/types';
import { BaseEntityProtectedColumn } from './base';

export class EntityPlainProtectedColumn extends BaseEntityProtectedColumn {
  public constructor(options: BaseProtectedColumnOptions) {
    super(options);
  }

  public getProtectedColumnType() {
    return ProtectedColumnTypes.PLAIN;
  }
}
