import { Database } from "./structs/Database";
import { Schema } from "./structs/Schema";

const database = new Database({
  provider: 'json',
  path: './database'
})

const userSchema = Schema.create({
  id: Schema.number(),
  data: {
    name: Schema.string(),
    age: Schema.number()
  }
})

const userRepository = database.createRepository('users', userSchema);

userRepository.create({ id: 1 }) // returns { id: 1 }
userRepository.data() // returns all data from the repository;
userRepository.get(1) // returns { id: 1 }
userRepository.update({ id: 1, data: { name: 'John Doe', age: 18 } }) // returns true
userRepository.delete(1) // returns true
userRepository.delete(1) // returns false