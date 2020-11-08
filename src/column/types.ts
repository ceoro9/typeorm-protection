import { EncryptOptions, HashOptions } from '@core/crypto';

export type DecryptSlaveKey = (cipheredSlaveKey: Buffer, masterKeyId: string) => Buffer;

export interface ColumnEncryptionKeys {
  slaveKey: Buffer;
  cipheredSlaveKey: Buffer;
  masterKeyId: string;
  decryptSlaveKey: DecryptSlaveKey;
}

export interface BaseProtectedColumnOptions {
  binaryTextFormat: BufferEncoding;
  hash?: HashOptions;
}

export interface ColumnProtectionOptions extends BaseProtectedColumnOptions {
  encrypt: EncryptOptions;
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
  type: ProtectedColumnTypes;
  protectedData: Buffer;
  hash?: {
    data: Buffer;
    algorithm: string;
  };
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface PlainColumn extends BaseColumn {}

export interface EncryptedColumn extends BaseColumn {
  encrypt: {
    algorithm: string;
    iv: Buffer;
    masterKeyId: string;
    cipheredSlaveKey: Buffer;
  };
}
