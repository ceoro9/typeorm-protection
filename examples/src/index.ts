import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

async function main() {
  const connection = await createConnection();

  console.log('Loading users from the database...');
  const [user] = await connection.manager.find(User);

  console.log(`firstName = ${user.firstName}`);
  console.log(`lastName  = ${user.lastName.getPayload()}`);
}

main();
