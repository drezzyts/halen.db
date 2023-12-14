import { Database } from "../structs/Database";
import { SchemaInferType, SchemaObject } from "./schema";

export interface RepositoryOptions {
  name: string,
  path: string,
  database: Database,
}

export type RepositoryFileContent<T extends SchemaInferType<S>, S extends SchemaObject> = {
  [id: string]: T;
};

export type RepositoryInputData<T extends SchemaInferType<S>, S extends SchemaObject> = Partial<Omit<T, 'id'>> & Pick<T, 'id'>; 