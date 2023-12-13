import { createRepositoryFile, getRepositoryContent, writeRepositoryContent } from "../functions/json";
import { RepositoryOptions } from "../types/repository";
import { isValidPath } from "../functions/validators";
import { Database } from "./Database";

import HalenError from "./HalenError";
import { SchemaInferType, SchemaLiteral, SchemaLiteralsType, SchemaObject } from "../types/schema";
import { Schema } from "./Schema";

export class Repository<T extends SchemaObject, S extends Schema<T>> {
  public name: string;
  public path: string;
  public schema: S;
  public database: Database;

  public constructor(schema: S, options: RepositoryOptions) {
    this.validateOptions(options, schema);

    this.name = options.name;
    this.path = options.path;
    this.schema = schema;
    this.database = options.database;

    this.init();
  }

  private validateOptions(options: RepositoryOptions, schema: S) {
    if(!options.name) throw new HalenError('INVALID_REPOSITORY_NAME');
    if(!options.path || !isValidPath(options.database.path)) throw new HalenError('INVALID_PATH');
    if(!schema) throw new HalenError('INVALID_REPOSITORY_SCHEMA');
    if(!options.database) throw new HalenError('INVALID_REPOSITORY_DATABASE');
  }

  private init() {
    if(!isValidPath(this.path)) createRepositoryFile(this.path);
    return true;
  }

  public get<U extends SchemaInferType<S['object']>>(id: U['id']): Partial<U> {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const value = repositoryData[id as keyof typeof repositoryData];

    return value;
  }

  public create<U extends SchemaInferType<S['object']>>(data: Partial<Omit<U, 'id'>> & Pick<U, 'id'>): Partial<U> {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const value = repositoryData[data.id as keyof typeof repositoryData];
    
    if(value) return value;
    
    const missingRequiredKeys = this.schema.requiredKeys.filter(key => !Object.keys(data).includes(key));
    if(missingRequiredKeys.length > 0) {
      throw new HalenError('INVALID_CREATE_DATA', `\n Missing required keys: ${missingRequiredKeys.join(', ')}`);
    }

    const isValid = Object.entries(data).every(([key, value]) => {
      const literal = this.schema.object[key as keyof typeof this.schema.object] as SchemaLiteralsType;
      return literal.__validate__(value);
    })

    if(!isValid) throw new HalenError('INVALID_CREATE_DATA');

    const newData = {
      ...this.schema.defaultObject,
      ...data,
    }

    repositoryData[data.id as keyof typeof repositoryData] = newData as U;

    writeRepositoryContent(this.path, repositoryData);

    return newData as Partial<U>;
  }
}