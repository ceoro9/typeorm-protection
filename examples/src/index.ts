import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

async function main() {
  const connection = await createConnection();

  console.log('Inserting a new user into the database...');
  const user = new User();
  user.firstName = 'FirstName';
  user.lastName = 'LastName';
  await connection.manager.save(user);
  console.log('Saved a new user with id: ' + user.id);

  console.log('Loading users from the database...');
  const users = await connection.manager.find(User);
  console.log('Loaded users: ', users);
}

main();
