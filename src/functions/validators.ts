import { DatabaseProvider } from "../types/database";
import { existsSync } from "fs";
import { SchemaSubObject } from "../types/schema";

export function isValidProvider(provider: string): provider is DatabaseProvider {
  return ['json', 'mongodb'].includes(provider);
}

export function isValidPath(path: string): boolean {
  return existsSync(path);
}

export function isArray(value: Array<any>): value is Array<any> {
  return Array.isArray(value);
}

export function isObject(value: any): value is object {
  return typeof value === 'object' && !isArray(value) && value !== null;
}

export function isSchemaSubObject(data: any): data is SchemaSubObject {
  return data.constructor.name === 'Object';
}