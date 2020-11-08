import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EncryptedColumnProtection } from '../../../src';

const encryptedColumnOptions = {
  hash: {
    algorithm: 'sha256',
  },
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @EncryptedColumnProtection(encryptedColumnOptions)
  public firstName: string;

  @EncryptedColumnProtection(encryptedColumnOptions)
  public lastName: string;
}
