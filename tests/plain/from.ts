import crypto from 'crypto';
import { EntityPlainProtectedColumn } from '@column/entities';

describe('Plain entity column protection FROM', () => {
  test(`String data should be deserialized in the same format it's stored`, () => {
    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: 'hex',
    });
    const serializedData = {
      _type: 'plain',
      data: 'hello',
    };

    const result = entityPlain.protectFrom(serializedData);

    expect(result).toEqual(serializedData.data);
  });

  test(`Hash digest should be validated`, () => {
    const data = 'hello';
    const hashAlgorithm = 'sha256';
    const binaryTextFormat = 'hex';

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat,
      hash: {
        algorithm: hashAlgorithm,
      },
    });

    const serializedData = {
      _type: 'plain',
      data: data,
      hashAlgorithm: hashAlgorithm,
      hash: crypto.createHash(hashAlgorithm).update(data).digest().toString(binaryTextFormat),
    };

    const result = entityPlain.protectFrom(serializedData);

    expect(result).toEqual(serializedData.data);
  });

  test(`Hash digest should be validated with via custom provided function`, () => {
    const hashAlgorithm = 'sha256';
    const binaryTextFormat = 'hex';
    const hashValue = Buffer.from('nice');

    const hashPayloadFn = jest.fn(() => hashValue);

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat,
      hash: {
        makeHash: hashPayloadFn,
        hashOptions: {
          algorithm: hashAlgorithm,
        },
      },
    });

    const serializedData = {
      _type: 'plain',
      data: 'data',
      hashAlgorithm: hashAlgorithm,
      hash: hashValue.toString(binaryTextFormat),
    };

    entityPlain.protectFrom(serializedData);

    expect(hashPayloadFn).toBeCalled();
  });

  test(`Exception should be thrown, when hash digest mismatches`, () => {
    const data = 'hello';
    const hashAlgorithm = 'sha256';
    const binaryTextFormat = 'hex';

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat,
      hash: {
        algorithm: hashAlgorithm,
      },
    });

    const serializedData = {
      _type: 'plain',
      data: data,
      hashAlgorithm: hashAlgorithm,
      hash: crypto.createHash(hashAlgorithm).update('someother').digest().toString(binaryTextFormat),
    };

    expect(entityPlain.protectFrom.bind(entityPlain, serializedData)).toThrowError();
  });

  test(`Exception should be thrown, when hash digest is mismatched via custom function`, () => {
    const hashAlgorithm = 'sha256';
    const binaryTextFormat = 'hex';
    const hashValue = Buffer.from('some_data');

    const hashPayloadFn = jest.fn(() => hashValue);

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat,
      hash: {
        makeHash: hashPayloadFn,
        hashOptions: {
          algorithm: hashAlgorithm,
        },
      },
    });

    const serializedData = {
      _type: 'plain',
      data: 'data',
      hashAlgorithm: hashAlgorithm,
      hash: Buffer.from('some_other_data').toString(binaryTextFormat),
    };

    expect(entityPlain.protectFrom.bind(entityPlain, serializedData)).toThrowError();
  });

  test(`Exception should be thrown, when binary text format is mismatched`, () => {
    const data = 'hello';
    const hashAlgorithm = 'sha256';
    const binaryTextFormatV1 = 'base64';
    const binaryTextFormatV2 = 'hex';

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat: binaryTextFormatV1,
      hash: {
        algorithm: hashAlgorithm,
      },
    });

    const serializedData = {
      _type: 'plain',
      data: data,
      hashAlgorithm: hashAlgorithm,
      hash: crypto.createHash(hashAlgorithm).update(data).digest().toString(binaryTextFormatV2),
    };

    expect(entityPlain.protectFrom.bind(entityPlain, serializedData)).toThrowError();
  });

  test(`Exception should be thrown, when unknown column type shows up`, () => {
    const data = 'hello';
    const hashAlgorithm = 'sha256';
    const binaryTextFormat = 'hex';

    const entityPlain = new EntityPlainProtectedColumn({
      binaryTextFormat,
      hash: {
        algorithm: hashAlgorithm,
      },
    });

    const serializedData = {
      _type: 'some_unknown_type',
      data: data,
      hashAlgorithm: hashAlgorithm,
      hash: crypto.createHash(hashAlgorithm).update(data).digest().toString(binaryTextFormat),
    };

    expect(entityPlain.protectFrom.bind(entityPlain, serializedData)).toThrowError();
  });
});
