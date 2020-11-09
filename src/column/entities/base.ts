import { Json } from '@utils/types';
import { hash, verifyHash } from '@core/crypto';
import { isHashPayloadFn } from '@column/checks';
import { getStrictStringFromJson } from '@utils/object';
import { BaseColumn, BaseProtectedColumnOptions, PayloadToProtect, ProtectedColumnTypes } from '@column/types';
import {
  PROTECTION_TYPE_PROP_NAME,
  HASHED_PROTECTED_DATA_PROP_NAME,
  HASH_ALGORITHM_PROP_NAME,
  PROTECTED_DATA_PROP_NAME,
} from './constants';

export abstract class BaseEntityProtectedColumn {
  public constructor(private readonly options: BaseProtectedColumnOptions) {}

  public protectTo(payload: PayloadToProtect): Partial<Json> {
    return this.serializeProtectedColumn({
      type: this.getProtectedColumnType(),
      protectedData: payload,
      hash: this.makeHashColumnProtection(payload),
    });
  }

  public protectFrom(data: Json): PayloadToProtect {
    const { protectedData, hash } = this.deserializeProtectedColumn(data);
    const bufferPayload = Buffer.from(protectedData);
    this.verifyProtectedColumnHash(bufferPayload, hash);
    return protectedData;
  }

  public abstract getProtectedColumnType(): ProtectedColumnTypes;

  public getSerializedProtectedColumnType(payload: Json) {
    return getStrictStringFromJson(payload, PROTECTION_TYPE_PROP_NAME);
  }

  public getBinaryTextFormat() {
    return this.options.binaryTextFormat;
  }

  protected serializeProtectedColumn(payload: BaseColumn): Partial<Json> {
    const { hash } = payload;
    const binaryTextFormat = this.getBinaryTextFormat();
    return {
      [PROTECTION_TYPE_PROP_NAME]: this.getProtectedColumnType(),
      [PROTECTED_DATA_PROP_NAME]: payload.protectedData,
      [HASH_ALGORITHM_PROP_NAME]: hash?.algorithm,
      [HASHED_PROTECTED_DATA_PROP_NAME]: hash?.data.toString(binaryTextFormat),
    };
  }

  protected deserializeProtectedColumn(payload: Json): BaseColumn {
    const columnType = this.getSerializedProtectedColumnType(payload);
    if (columnType != this.getProtectedColumnType()) {
      throw new Error(`Unknown column type 'columnType'`);
    }
    return {
      type: columnType,
      protectedData: getStrictStringFromJson(payload, PROTECTED_DATA_PROP_NAME),
      hash: this.getHashColumnProtection(payload),
    };
  }

  protected makeHashColumnProtection(columnData: PayloadToProtect) {
    const options = this.getHashOptions();
    if (!options) {
      return;
    }

    const bufferData = Buffer.from(columnData);

    if (isHashPayloadFn(options)) {
      const { makeHash, hashOptions } = options;
      return {
        data: makeHash(bufferData, hashOptions),
        algorithm: hashOptions.algorithm,
      };
    }

    const { data } = hash(bufferData, options);
    return {
      data,
      algorithm: options.algorithm,
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
    const options = this.getHashOptions();

    if (!hash || !options) {
      return;
    }

    if (isHashPayloadFn(options)) {
      const { makeHash, hashOptions } = options;
      const computedHash = makeHash(data, hashOptions);
      if (computedHash.compare(hash.data)) {
        throw new Error(`Hash digest mismatch`);
      }
    } else {
      verifyHash(data, hash.data, {
        algorithm: hash.algorithm,
      });
    }
  }

  protected getHashOptions() {
    return this.options.hash;
  }
}
