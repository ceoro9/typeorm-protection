import { Emptyable, Json } from '@utils/types';
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
  algorithm?: string;
}

export interface ProtectedColumnOptions {
  binaryTextFormat?: BufferEncoding;
  encrypt?: ProtectedColumnEncryptOptions;
  hash?: ProtectedColumnHashOptions;
}

export interface InputFrom {
  type: 'from';
  data: Emptyable<Json>;
  decoder: (data: Json) => Emptyable<string>;
}

export interface InputTo {
  type: 'to';
  value: Emptyable<string>;
}
