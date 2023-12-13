import { DatabaseOptions, DatabaseProvider } from "../types/database";
import { isValidPath, isValidProvider } from "../functions/validators";
import { join } from "path";

import HalenError from "./HalenError";
import { createDatabaseFolder } from "../functions/json";

export class Database {
  public static instance: Database;
  public provider: DatabaseProvider;
  public path: string;

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
}