import crypto from 'crypto';
import { EntityPlainProtectedColumn } from '@column/entities';

describe('Plain entity column protection TO', () => {
  test('Data should be saved as it is with binaryTextFormat specified', () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['data']).toEqual(testData);
  });

  test('Data should be saved as it is with hashing disabled', () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['data']).toEqual(testData);
  });

  test('Data should be saved as it is with hashing enabled', () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        algorithm: 'sha256',
      },
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['data']).toEqual(testData);
  });

  test(`Hash of protected data should be saved, when 'hash' option is specified`, () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        algorithm: 'sha256',
      },
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(typeof result['hash']).toBe('string');
  });

  test(`Hash of protected data should not be saved, when 'hash' option is not specified`, () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['hash']).toBeUndefined();
  });

  test('Specified hash algorithm should be in serialized result after protection', () => {
    const hashAlgorithm = 'sha256';
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        algorithm: hashAlgorithm,
      },
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['hashAlgorithm']).toEqual(hashAlgorithm);
  });

  test('Compare sha256 hash of protected data', () => {
    const binaryTextFormat = 'hex';
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        algorithm: 'sha256',
      },
    });

    const testData = 'testData';
    const testDataHash = crypto.createHash('sha256').update(testData).digest();

    const result = entityPlain.protectTo(testData);

    expect(result['hash']).toBeDefined();
    expect(result['hash']).toEqual(testDataHash.toString(binaryTextFormat));
  });

  test('Compare md5 hash of protected data', () => {
    const binaryTextFormat = 'hex';
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat,
      hash: {
        algorithm: 'md5',
      },
    });

    const testData = 'testData';
    const testDataHash = crypto.createHash('md5').update(testData).digest();

    const result = entityPlain.protectTo(testData);

    expect(result['hash']).toBeDefined();
    expect(result['hash']).toEqual(testDataHash.toString(binaryTextFormat));
  });

  test(`Different 'binaryTextFormat' result in different stored hash value`, () => {
    const base64EntityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'base64',
      hash: {
        algorithm: 'md5',
      },
    });
    const hexEntityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        algorithm: 'md5',
      },
    });

    const testData = 'testData';

    const base64Result = base64EntityPlain.protectTo(testData);
    const hexResult = hexEntityPlain.protectTo(testData);

    expect(base64Result['hash']).not.toEqual(hexResult['hash']);
  });

  test(`Specified custom hash function is called`, () => {
    const makeHashMockFn = jest.fn((payload: Buffer) => crypto.createHash('md5').update(payload).digest());
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        makeHash: makeHashMockFn,
        hashOptions: {
          algorithm: 'md5',
        },
      },
    });

    entityPlain.protectTo('testData');

    expect(makeHashMockFn).toBeCalled();
  });

  test(`Specified custom hash function result is serialized`, () => {
    const hashPayload = (payload: Buffer) => crypto.createHash('md5').update(payload).digest();
    const makeHashMockFn = jest.fn(hashPayload);

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        makeHash: makeHashMockFn,
        hashOptions: {
          algorithm: 'md5',
        },
      },
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['hash']).toEqual(hashPayload(Buffer.from(testData)).toString('hex'));
  });

  test(`With specified custom hash function protected data should be serialized as it is`, () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        makeHash: (payload: Buffer) => crypto.createHash('md5').update(payload).digest(),
        hashOptions: {
          algorithm: 'md5',
        },
      },
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['data']).toEqual(testData);
  });

  test('With specified custom hash function, algorithm should be saved as it was specified', () => {
    const hashAlgorithm = 'md5';
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
      hash: {
        makeHash: (payload: Buffer) => crypto.createHash('md5').update(payload).digest(),
        hashOptions: {
          algorithm: 'md5',
        },
      },
    });

    const testData = 'testData';
    const result = entityPlain.protectTo(testData);

    expect(result['hashAlgorithm']).toEqual(hashAlgorithm);
  });
});
