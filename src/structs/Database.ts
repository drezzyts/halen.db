import { DatabaseOptions, DatabaseProvider } from "../types/database";
import { isValidPath, isValidProvider } from "../functions/validators";
import { join } from "path";

import HalenError from "./HalenError";
import { createDatabaseFolder } from "../functions/json";
import { Repository } from "./Repository";
import { SchemaObject } from "../types/schema";
import { Schema } from "./Schema";

export class Database {
  public static instance: Database;
  public provider: DatabaseProvider;
  public path: string;
  public repositories: Array<Repository<any, any>> = [];

  public constructor(options: DatabaseOptions) {
    if(Database.instance) throw new HalenError('DATABASE_ALREADY_INITIALIZED');
    if(!isValidProvider(options.provider)) throw new HalenError('INVALID_PROVIDER');
    
    const path = join(process.cwd(), options.path);

    if(!isValidPath(path)) createDatabaseFolder(path);
    if(!isValidPath(path)) throw new HalenError('INVALID_PATH');

    this.provider = options.provider;
    this.path = path;

    Database.instance = this;
  }

  public static getInstance() {
    if(!Database.instance) throw new HalenError('DATABASE_NOT_INITIALIZED');
    return Database.instance;
  }

  public createRepository<T extends SchemaObject>(name: string, schema: Schema<T>) {
    const repository = new Repository(schema, {
      name,
      path: join(this.path, `${name}.json`),
      database: this
    });

    this.repositories.push(repository);
    return repository;
  }

  public getRepository(name: string) {
    const repository = this.repositories.find(repository => repository.name === name);
    return repository;
  }
}