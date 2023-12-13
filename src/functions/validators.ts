import { DatabaseProvider } from "../types/database";
import { existsSync } from "fs";

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