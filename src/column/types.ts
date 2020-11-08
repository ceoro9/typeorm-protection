import { EncryptOptions, HashOptions } from '@core/crypto';

export type PayloadToProtect = string;

export type DecryptSlaveKey = (cipheredSlaveKey: Buffer, masterKeyId: string) => Buffer;

export interface ColumnEncryptionKeys {
  slaveKey: Buffer;
  cipheredSlaveKey: Buffer;
  masterKeyId: string;
  decryptSlaveKey: DecryptSlaveKey;
}

export interface HashPayloadOptions {
  algorithm: string;
}

export interface HashPayload {
  makeHash: (payload: Buffer, hashOptions: HashPayloadOptions) => Buffer;
  hashOptions: HashPayloadOptions;
}

export interface BaseProtectedColumnOptions {
  binaryTextFormat: BufferEncoding;
  hash?: HashOptions | HashPayload;
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
  protectedData: PayloadToProtect;
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
