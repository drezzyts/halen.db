import { Database } from "./structs/Database";
import { Schema } from "./structs/Schema";
import { SchemaInferType } from "./types/schema";

const database = new Database({
  provider: 'json',
  path: './database'
})

const userSchema = Schema.create({
  id: Schema.number().required(),
  data: {
    name: Schema.string(),
    age: Schema.number()
  }
})

const userRepository = database.createRepository('users', userSchema);

const user: SchemaInferType<typeof userSchema.object> = {
  id: 1
}