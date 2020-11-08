import { DecryptSlaveKey } from '@column/types';

export interface ProtectedColumnEncryptOptions {
  algorithm?: string;
  ivLength?: number;
  masterKeyId: string;
  cipheredSlaveKey: Buffer;
  slaveKey: Buffer;
  decryptSlaveKey: DecryptSlaveKey;
}

export interface ProtectedColumnHashOptions {
  algorithm: string;
}

export interface ProtectedColumnOptions {
  binaryTextFormat?: BufferEncoding;
  encrypt?: ProtectedColumnEncryptOptions;
  hash?: ProtectedColumnHashOptions;
}
