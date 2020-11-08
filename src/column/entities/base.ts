import { Json } from '@utils/types';
import { hash, verifyHash } from '@core/crypto';
import { getStrictStringFromJson } from '@utils/object';
import { BaseColumn, BaseProtectedColumnOptions, ProtectedColumnTypes } from '@column/types';
import {
  PROTECTION_TYPE_PROP_NAME,
  HASHED_PROTECTED_DATA_PROP_NAME,
  HASH_ALGORITHM_PROP_NAME,
  PROTECTED_DATA_PROP_NAME,
} from './constants';

export abstract class BaseEntityProtectedColumn {
  public constructor(private readonly options: BaseProtectedColumnOptions) {}

  public protectTo(payload: Buffer): Partial<Json> {
    return this.serializeProtectedColumn({
      type: this.getProtectedColumnType(),
      protectedData: payload,
      hash: this.makeHashColumnProtection(payload),
    });
  }

  public protectFrom(data: Json): Buffer {
    const { protectedData, hash } = this.deserializeProtectedColumn(data);
    this.verifyProtectedColumnHash(Buffer.from(protectedData), hash);
    return protectedData;
  }

  public abstract getProtectedColumnType(): ProtectedColumnTypes;

  public getSerializedProtectedColumnType(payload: Json) {
    return getStrictStringFromJson(payload, PROTECTION_TYPE_PROP_NAME);
  }

  protected serializeProtectedColumn(payload: BaseColumn): Partial<Json> {
    const { hash } = payload;
    const binaryTextFormat = this.getBinaryTextFormat();
    return {
      [PROTECTION_TYPE_PROP_NAME]: this.getProtectedColumnType(),
      [PROTECTED_DATA_PROP_NAME]: payload.protectedData.toString(binaryTextFormat),
      [HASH_ALGORITHM_PROP_NAME]: hash?.algorithm,
      [HASHED_PROTECTED_DATA_PROP_NAME]: hash?.data.toString(binaryTextFormat),
    };
  }

  protected deserializeProtectedColumn(payload: Json): BaseColumn {
    const binaryTextFormat = this.getBinaryTextFormat();
    const columnType = this.getSerializedProtectedColumnType(payload);
    if (columnType != this.getProtectedColumnType()) {
      throw new Error(`Unknown column type 'columnType'`);
    }
    return {
      type: columnType,
      protectedData: Buffer.from(getStrictStringFromJson(payload, PROTECTED_DATA_PROP_NAME), binaryTextFormat),
      hash: this.getHashColumnProtection(payload),
    };
  }

  protected makeHashColumnProtection(columnData: Buffer) {
    const hashOptions = this.getHashOptions();
    if (!hashOptions) {
      return;
    }
    const { data } = hash(columnData, hashOptions);
    return {
      data,
      algorithm: hashOptions.algorithm,
    };
  }

  protected getHashColumnProtection(payload: Json) {
    const binaryTextFormat = this.getBinaryTextFormat();
    try {
      return {
        algorithm: getStrictStringFromJson(payload, HASH_ALGORITHM_PROP_NAME),
        data: Buffer.from(getStrictStringFromJson(payload, HASHED_PROTECTED_DATA_PROP_NAME), binaryTextFormat),
      };
    } catch (e) {
      return;
    }
  }

  protected verifyProtectedColumnHash(data: Buffer, hash: BaseColumn['hash']) {
    if (hash) {
      verifyHash(data, hash.data, {
        algorithm: hash.algorithm,
      });
    }
  }

  protected getBinaryTextFormat() {
    return this.options.binaryTextFormat;
  }

  protected getHashOptions() {
    return this.options.hash;
  }
}
