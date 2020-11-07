import { Json } from '@utils/types';
import { decrypt, encrypt, hash, verifyHash } from '@core/crypto';
import { serializeProtectedColumnDataObject, deserializeProtectedColumnDataObject } from './serialization';
import { ColumnEncryptionKeys, ColumnProtectionOptions, ProtectedColumnTypes, ProtectedColumn } from './types';

export class EntityColumnProtection {
  public constructor(
    private readonly encryptionKeys: ColumnEncryptionKeys,
    private readonly protectionOptions: ColumnProtectionOptions,
  ) {}

  /**
   * Encrypts column's data
   * @param columnData that needs to be encrypted
   * @returns json object, that should be stored in database
   */
  protected encryptColumn(columnData: Buffer): Partial<Json> {
    return serializeProtectedColumnDataObject(
      {
        type: ProtectedColumnTypes.ENCRYPTED,
        encrypt: this.getEncryptColumnData(columnData),
        hash: this.getHashColumnData(columnData),
      },
      this.getSerializationOptions(),
    );
  }

  /**
   * Decrypts column's data
   * @param protectedColumnData json object, that is stored in database
   * @returns decrypted data
   */
  public decryptColumn(protectedColumnData: Json) {
    const serializationOptions = this.getSerializationOptions();
    const protectedColumn = deserializeProtectedColumnDataObject(protectedColumnData, serializationOptions);

    if (protectedColumn.type === ProtectedColumnTypes.ENCRYPTED) {
      const { encrypt, hash } = protectedColumn;
      const decryptedData = decrypt(encrypt.data, this.decryptSlaveKey(encrypt.cipheredSlaveKey, encrypt.masterKeyId), {
        iv: encrypt.iv,
        algorithm: encrypt.algorithm,
      });
      this.verifyProtectedColumnHash(decryptedData, hash);
      return decryptedData;
    } else {
      const {
        plain: { data },
        hash,
      } = protectedColumn;
      this.verifyProtectedColumnHash(Buffer.from(data), hash);
      return data;
    }
  }

  /**
   * Stores data as it is without encryption
   * @param plainData that should be stored as it is
   */
  public plainColumn(columnData: string): Partial<Json> {
    return serializeProtectedColumnDataObject(
      {
        type: ProtectedColumnTypes.PLAIN,
        plain: { data: columnData },
        hash: this.getHashColumnData(Buffer.from(columnData)),
      },
      this.getSerializationOptions(),
    );
  }

  protected verifyProtectedColumnHash(data: Buffer, hash: ProtectedColumn['hash']) {
    if (hash) {
      verifyHash(data, hash.data, {
        algorithm: hash.algorithm,
      });
    }
  }

  protected getEncryptColumnData(columnData: Buffer) {
    const encryptOptions = this.getEncryptOptions();
    const dataKey = this.getSlaveKey();
    const { data, iv } = encrypt(columnData, dataKey, encryptOptions);
    return {
      iv,
      data,
      masterKeyId: this.getMasterKeyId(),
      cipheredSlaveKey: this.getCipheredSlaveKey(),
      algorithm: this.getEncryptOptions().algorithm,
    };
  }

  protected getHashColumnData(columnData: Buffer) {
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

  protected getSerializationOptions() {
    return {
      binaryTextFormat: this.getBinaryTextFormat(),
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

  private getHashOptions() {
    return this.getProtectionOptions().hash;
  }

  private getBinaryTextFormat() {
    return this.getProtectionOptions().binaryTextFormat;
  }

  private getEncryptionKeys() {
    return this.encryptionKeys;
  }

  private getProtectionOptions() {
    return this.protectionOptions;
  }
}
