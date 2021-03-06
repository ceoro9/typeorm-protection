import { Json } from '@utils/types';
import { decrypt, encrypt } from '@core/crypto';
import { getStrictStringFromJson } from '@utils/object';
import { BaseEntityProtectedColumn } from './base';
import {
  ColumnEncryptionKeys,
  ColumnProtectionOptions,
  EncryptedColumn,
  PayloadToProtect,
  ProtectedColumnTypes,
} from '@column/types';
import {
  CIPHERED_SLAVE_KEY_PROP_NAME,
  CIPHER_ALGORITHM_PROP_NAME,
  MASTER_KEY_ID_PROP_NAME,
  IV_PROP_NAME,
} from './constants';

export class EntityEncryptionProtectedColumn extends BaseEntityProtectedColumn {
  public constructor(
    private readonly encryptionKeys: ColumnEncryptionKeys,
    private readonly protectionOptions: ColumnProtectionOptions,
  ) {
    super(protectionOptions);
  }

  public protectTo(columnData: PayloadToProtect): Partial<Json> {
    const binaryTextFormat = this.getBinaryTextFormat();
    const encryptedColumnData = this.getEncryptColumnData(columnData);
    return this.serializeProtectedColumn({
      type: ProtectedColumnTypes.ENCRYPTED,
      protectedData: encryptedColumnData.data.toString(binaryTextFormat),
      encrypt: encryptedColumnData,
      hash: this.makeHashColumnProtection(columnData),
    });
  }

  public protectFrom(protectedColumnData: Json) {
    const { protectedData, encrypt, hash } = this.deserializeProtectedColumn(protectedColumnData);
    const binaryTextFormat = this.getBinaryTextFormat();
    const encryptedBufferData = Buffer.from(protectedData, binaryTextFormat);
    const slaveKey = this.decryptSlaveKey(encrypt.cipheredSlaveKey, encrypt.masterKeyId);
    const decryptedData = decrypt(encryptedBufferData, slaveKey, {
      iv: encrypt.iv,
      algorithm: encrypt.algorithm,
    });
    this.verifyProtectedColumnHash(decryptedData, hash);
    return decryptedData.toString();
  }

  public getProtectedColumnType() {
    return ProtectedColumnTypes.ENCRYPTED;
  }

  protected serializeProtectedColumn(payload: EncryptedColumn): Partial<Json> {
    const { encrypt } = payload;
    const binaryTextFormat = this.getBinaryTextFormat();
    return {
      ...super.serializeProtectedColumn(payload),
      [CIPHER_ALGORITHM_PROP_NAME]: encrypt.algorithm,
      [MASTER_KEY_ID_PROP_NAME]: encrypt.masterKeyId,
      [CIPHERED_SLAVE_KEY_PROP_NAME]: encrypt.cipheredSlaveKey.toString(binaryTextFormat),
      [IV_PROP_NAME]: encrypt.iv.toString(binaryTextFormat),
    };
  }

  protected deserializeProtectedColumn(payload: Json) {
    const binaryTextFormat = this.getBinaryTextFormat();
    return {
      ...super.deserializeProtectedColumn(payload),
      encrypt: {
        algorithm: getStrictStringFromJson(payload, CIPHER_ALGORITHM_PROP_NAME),
        cipheredSlaveKey: Buffer.from(getStrictStringFromJson(payload, CIPHER_ALGORITHM_PROP_NAME), binaryTextFormat),
        masterKeyId: getStrictStringFromJson(payload, MASTER_KEY_ID_PROP_NAME),
        iv: Buffer.from(getStrictStringFromJson(payload, IV_PROP_NAME), binaryTextFormat),
      },
    };
  }

  protected getEncryptColumnData(columnData: PayloadToProtect) {
    const encryptOptions = this.getEncryptOptions();
    const dataKey = this.getSlaveKey();
    const bufferData = Buffer.from(columnData);
    const { data, iv } = encrypt(bufferData, dataKey, encryptOptions);
    return {
      iv,
      data,
      masterKeyId: this.getMasterKeyId(),
      cipheredSlaveKey: this.getCipheredSlaveKey(),
      algorithm: this.getEncryptOptions().algorithm,
    };
  }

  protected decryptSlaveKey(cipheredSlaveKey: Buffer, masterKeyId: string) {
    return this.getEncryptionKeys().decryptSlaveKey(cipheredSlaveKey, masterKeyId);
  }

  private getSlaveKey() {
    return this.getEncryptionKeys().slaveKey;
  }

  private getCipheredSlaveKey() {
    return this.getEncryptionKeys().cipheredSlaveKey;
  }

  private getMasterKeyId() {
    return this.getEncryptionKeys().masterKeyId;
  }

  private getEncryptOptions() {
    return this.getProtectionOptions().encrypt;
  }

  private getEncryptionKeys() {
    return this.encryptionKeys;
  }

  private getProtectionOptions() {
    return this.protectionOptions;
  }
}
