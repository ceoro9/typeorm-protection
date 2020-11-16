import { ColumnEncryptionKeys } from '@column/types';
import { EntityEncryptionProtectedColumn } from '@column/entities';

describe('Encrypted column protectection FROM', () => {
  const defaultBinaryTextFormat = 'hex';

  const masterKeyId = 'master_key_id';
  const slaveKey = Buffer.from('ExchangePasswordPasswordExchange');

  const columnEncryptionKeys: ColumnEncryptionKeys = {
    masterKeyId: masterKeyId,
    slaveKey: slaveKey,
    cipheredSlaveKey: Buffer.from('ffffff', 'hex'), // random
    decryptSlaveKey: () => slaveKey,
  };

  const encryptOptions = {
    algorithm: 'AES-256-CBC',
    ivLength: 16,
  };

  const encryptedColumnProtection = new EntityEncryptionProtectedColumn(columnEncryptionKeys, {
    binaryTextFormat: defaultBinaryTextFormat,
    encrypt: encryptOptions,
  });

  const testData = 'testData';
  const result = encryptedColumnProtection.protectTo(testData);

  const serializedDataExample = {
    _type: 'encrypted',
    data: <string>result['data'],
    cipherAlgorithm: 'AES-256-CBC',
    masterKeyId: 'super_secret_master_key_id',
    cipheredSlaveKey: 'ff01ff',
    iv: <string>result['iv'],
  };

  test('Decrypted data should be equal to the source', () => {
    const result = encryptedColumnProtection.protectFrom(serializedDataExample);
    expect(result).toEqual(testData);
  });

  test('Decrypt slave key function should be called', () => {
    const decryptSlaveKeyMock = jest.fn(() => slaveKey);
    const options = {
      ...columnEncryptionKeys,
      decryptSlaveKey: decryptSlaveKeyMock,
    };

    const encryptedColumnProtection = new EntityEncryptionProtectedColumn(options, {
      binaryTextFormat: defaultBinaryTextFormat,
      encrypt: encryptOptions,
    });

    encryptedColumnProtection.protectFrom(serializedDataExample);
    expect(decryptSlaveKeyMock).toBeCalled();
  });

  test('Invalid IV should throw an error', () => {
    const data = {
      ...serializedDataExample,
      iv: 'azaza',
    };
    expect(encryptedColumnProtection.protectFrom.bind(encryptedColumnProtection, data)).toThrowError();
  });

  test('Invalid Cipher algorithm should throw an error', () => {
    const data = {
      ...serializedDataExample,
      cipherAlgorithm: 'azaza',
    };
    expect(encryptedColumnProtection.protectFrom.bind(encryptedColumnProtection, data)).toThrowError();
  });
});
