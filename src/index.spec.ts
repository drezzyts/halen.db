import { Database } from "./structs/Database";
import { Repository } from "./structs/Repository";
import { Schema } from "./structs/Schema";

const database = new Database({
  provider: 'json',
  path: './database'
})

const userSchema = Schema.create({
  id: Schema.string().required(),
  name: Schema.string().default('unnamed')
})

const repository = new Repository(userSchema, {
  name: 'users',
  path: './database/users.json',
  database
})

const user = repository.create({ id: 'drezzy' }) || repository.get('drezzy');

console.log(user)