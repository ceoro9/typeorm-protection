import crypto from 'crypto';

export interface HashOptions {
  algorithm: string;
}

export const hash = (payload: Buffer, options: HashOptions) => {
  const { algorithm } = options;
  const data = crypto.createHash(algorithm).update(payload).digest();
  return { data };
};

export const verifyHash = (data: Buffer, providedHash: Buffer, options: HashOptions) => {
  const { algorithm } = options;
  const computedHash = crypto.createHash(algorithm).update(data).digest();
  if (computedHash.compare(providedHash)) {
    throw new Error('Hash digest mismatch');
  }
};
