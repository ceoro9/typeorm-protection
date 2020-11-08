import { BaseProtectedColumnOptions, HashPayload } from './types';

export const isHashPayloadFn = (hash: BaseProtectedColumnOptions['hash']): hash is HashPayload => {
  return !!(hash as any).makeHash && !!(hash as any).options;
};
