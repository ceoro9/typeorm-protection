import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EncryptedColumnProtection } from '../../../src';

const hashedColumnOptions = {
  hash: {
    algorithm: 'sha256',
  },
};

const slaveKey = '073ECDE5C7D45D9C6D4727C37818F92B';

const encryptedColumnOptions = {
  encrypt: {
    algorithm: 'AES-256-CBC',
    ivLength: 16,
    masterKeyId: 'super_secret_master_key_id',
    cipheredSlaveKey: Buffer.from('ff01ff', 'hex'),
    slaveKey: Buffer.from(slaveKey),
    decryptSlaveKey: (cipheredSlaveKey: Buffer, masterKeyId: string) => {
      console.log('decrypting slave key :: ', cipheredSlaveKey, masterKeyId);
      return Buffer.from(slaveKey);
    },
  },
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @EncryptedColumnProtection(hashedColumnOptions)
  public firstName: string;

  @EncryptedColumnProtection(encryptedColumnOptions)
  public lastName: string;
}
