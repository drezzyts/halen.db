import {
  createRepositoryFile,
  getRepositoryContent,
  writeRepositoryContent,
} from "../functions/json";
import { RepositoryInputData, RepositoryOptions } from "../types/repository";
import { isValidPath } from "../functions/validators";
import { Database } from "./Database";

import HalenError from "./HalenError";
import {
  SchemaInferType,
  SchemaObject,
} from "../types/schema";
import { Schema } from "./Schema";
import {
  validateRepositoryCreateData,
  validateRepositoryUpdateData,
} from "../functions/repository";

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
    if (!options.name) throw new HalenError("INVALID_REPOSITORY_NAME");
    if (!options.path || !isValidPath(options.database.path))
      throw new HalenError("INVALID_PATH");
    if (!schema) throw new HalenError("INVALID_REPOSITORY_SCHEMA");
    if (!options.database) throw new HalenError("INVALID_REPOSITORY_DATABASE");
  }

  private init() {
    if (!isValidPath(this.path)) createRepositoryFile(this.path);
    return true;
  }

  public get<U extends SchemaInferType<T>>(id: U['id']): Partial<U> {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const value = repositoryData[id as keyof typeof repositoryData];

    return value;
  }

  public create<U extends SchemaInferType<T>>(
    data: RepositoryInputData<U, T>
  ): Partial<U> {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const value = repositoryData[data.id as U['id']];

    if (value) return value;

    validateRepositoryCreateData(this.schema, data);

    const newData = {
      ...this.schema.defaultObject,
      ...data,
    };

    repositoryData[data.id as U['id']] = newData as U;

    writeRepositoryContent(this.path, repositoryData);

    return newData as Partial<U>;
  }

  public update<U extends SchemaInferType<T>>(
    data: RepositoryInputData<U, T>
  ): boolean {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const value = repositoryData[data.id as U['id']];

    if (!value) return false;

    validateRepositoryUpdateData(this.schema, data);

    const newData = {
      ...value,
      ...data,
    };

    repositoryData[data.id as U['id']] = newData as U;

    writeRepositoryContent(this.path, repositoryData);

    return true;
  }

  public delete<U extends SchemaInferType<T>>(id: U["id"]): boolean {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const value = repositoryData[id as keyof typeof repositoryData];

    if (!value) return false;

    delete repositoryData[id as keyof typeof repositoryData];

    writeRepositoryContent(this.path, repositoryData);

    return true;
  }

  public data<U extends SchemaInferType<T>>(): Partial<U>[] {
    const repositoryData = getRepositoryContent<U, T>(this.path);
    const values = Object.values(repositoryData);

    return values || {};
  }
}
