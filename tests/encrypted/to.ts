import crypto from 'crypto';
import { ColumnEncryptionKeys } from '@column/types';
import { EntityEncryptionProtectedColumn } from '@column/entities/encrypted';

describe('Encrypted column protectection TO', () => {
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

  test('Encrypted data should be saved', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['data']).toBeDefined();
  });

  test('Encrypted data should be saved as string', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(typeof result['data']).toEqual('string');
  });

  test('Encrypted data should be saved in specified binary text format', () => {
    const hexEncryptedColumnProtection = new EntityEncryptionProtectedColumn(columnEncryptionKeys, {
      binaryTextFormat: 'hex',
      encrypt: encryptOptions,
    });

    const base64EncryptedColumnProtection = new EntityEncryptionProtectedColumn(columnEncryptionKeys, {
      binaryTextFormat: 'base64',
      encrypt: encryptOptions,
    });

    const testData = 'testData';

    const { data: hexData } = hexEncryptedColumnProtection.protectTo(testData);
    const { data: base64Data } = base64EncryptedColumnProtection.protectTo(testData);

    expect(hexData).toBeDefined();
    expect(base64Data).toBeDefined();

    expect(hexData).not.toEqual(base64Data);
  });

  test('Encrypted data should be saved alongside with algorithm it was encrypted with', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['cipherAlgorithm']).toBeDefined();
    expect(typeof result['cipherAlgorithm']).toEqual('string');
  });

  test('Encrypted data should be saved alongside with IV it was encrypted with', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['iv']).toBeDefined();
    expect(typeof result['iv']).toEqual('string');
  });

  test('Encrypted data should be saved alongside with master key id, that was used to decrypt slave key', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['masterKeyId']).toBeDefined();
    expect(typeof result['masterKeyId']).toEqual('string');
  });

  test('Encrypted data should be saved alongside with encrypted slave key, that was used to encrypt data', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['cipheredSlaveKey']).toBeDefined();
    expect(typeof result['cipheredSlaveKey']).toEqual('string');
  });

  test('Encrypted slave key should be saved in specified binary text format', () => {
    const encryptedColumnProtection = new EntityEncryptionProtectedColumn(columnEncryptionKeys, {
      binaryTextFormat: 'base64',
      encrypt: encryptOptions,
    });

    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);

    expect(result['cipheredSlaveKey']).toEqual(columnEncryptionKeys.cipheredSlaveKey.toString('base64'));
  });

  test('Saved encrypted slave key should be equal to the one specified in protection options', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['cipheredSlaveKey']).toEqual(columnEncryptionKeys.cipheredSlaveKey.toString(defaultBinaryTextFormat));
  });

  test('Saved master key id should be equal to the one specified in protection options', () => {
    const testData = 'testData';
    const result = encryptedColumnProtection.protectTo(testData);
    expect(result['masterKeyId']).toEqual(masterKeyId);
  });

  test(`Protected data encryption should be correctly implemented via 'crypto' package`, () => {
    const slaveKey = Buffer.from('ExchangePasswordPasswordExchange');

    const columnEncryptionKeys: ColumnEncryptionKeys = {
      masterKeyId: 'master_key',
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

    const cipher = crypto.createCipheriv(
      <string>result['cipherAlgorithm'],
      slaveKey,
      Buffer.from(<string>result['iv'], defaultBinaryTextFormat),
    );
    cipher.update(testData);

    const encryptedData = cipher.final(defaultBinaryTextFormat);

    expect(result['data']).toEqual(encryptedData);
  });

  test(`Protected data should be correctly decrypted via 'crypto' package, according to the specified options`, () => {
    const slaveKey = Buffer.from('ExchangePasswordPasswordExchange');

    const columnEncryptionKeys: ColumnEncryptionKeys = {
      masterKeyId: 'master_key',
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

    const cipher = crypto.createDecipheriv(
      <string>result['cipherAlgorithm'],
      slaveKey,
      Buffer.from(<string>result['iv'], defaultBinaryTextFormat),
    );
    cipher.update(Buffer.from(<string>result['data'], defaultBinaryTextFormat));

    const decryptedData = cipher.final('utf-8');

    expect(testData).toEqual(decryptedData);
  });
});
