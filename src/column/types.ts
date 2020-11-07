import { EncryptOptions, HashOptions } from '@core/crypto';

export type DecryptSlaveKey = (cipheredSlaveKey: Buffer, masterKeyId: string) => Buffer;

export interface ColumnEncryptionKeys {
  slaveKey: Buffer;
  cipheredSlaveKey: Buffer;
  masterKeyId: string;
  decryptSlaveKey: DecryptSlaveKey;
}

export interface ColumnProtectionOptions {
  binaryTextFormat: BufferEncoding;
  encrypt: EncryptOptions;
  hash?: HashOptions;
}

export interface SerializationOptions {
  binaryTextFormat: BufferEncoding;
}

export enum ProtectedColumnTypes {
  ENCRYPTED = 'encrypted',
  PLAIN = 'plain',
}

export type ProtectedColumn = EncryptedColumn | PlainColumn;

export interface BaseColumn {
  hash?: {
    data: Buffer;
    algorithm: string;
  };
}

export interface EncryptedColumn extends BaseColumn {
  type: ProtectedColumnTypes.ENCRYPTED;
  encrypt: {
    data: Buffer;
    algorithm: string;
    iv: Buffer;
    masterKeyId: string;
    cipheredSlaveKey: Buffer;
  };
}

export interface PlainColumn extends BaseColumn {
  type: ProtectedColumnTypes.PLAIN;
  plain: {
    data: string;
  };
}
