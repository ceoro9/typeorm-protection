import crypto from 'crypto';

export interface EncryptOptions {
  algorithm: string;
  ivLength: number;
}

export interface DecryptOptions {
  algorithm: string;
  iv: Buffer;
}

export const encrypt = (payload: Buffer, key: Buffer, options: EncryptOptions) => {
  const { algorithm, ivLength } = options;
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const updatedCipher = cipher.update(payload);
  const data = Buffer.concat([updatedCipher, cipher.final()]);
  return { data, iv };
};

export const decrypt = (payload: Buffer, key: Buffer, options: DecryptOptions) => {
  const { algorithm, iv } = options;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = decipher.update(payload);
  return Buffer.concat([decrypted, decipher.final()]);
};
