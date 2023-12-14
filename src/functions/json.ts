import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { SchemaInferType, SchemaObject } from "../types/schema";
import { RepositoryFileContent } from "../types/repository";


export function createDatabaseFolder(path: string) {
  mkdirSync(path);
  return true;
}

export function createRepositoryFile(path: string) {
  writeFileSync(path, JSON.stringify({}, null, '\t'));
  return true;
}

export function getRepositoryContent<T extends SchemaInferType<S>, S extends SchemaObject>(path: string): RepositoryFileContent<T, S> {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
}

export function writeRepositoryContent<T extends SchemaInferType<S>, S extends SchemaObject>(path: string, data: RepositoryFileContent<T, S>) {
  const content = JSON.stringify(data, null, '\t');
  writeFileSync(path, content)
}

