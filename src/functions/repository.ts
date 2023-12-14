import { SchemaInferType, SchemaLiteralsType, SchemaObject, SchemaSubObject } from "../types/schema";
import { Schema } from "../structs/Schema";

import HalenError from "../structs/HalenError";
import { RepositoryInputData } from "../types/repository";
import { isSchemaSubObject } from "./validators";

export function validateRepositoryCreateData<T extends SchemaObject, U extends SchemaInferType<T>>(schema: Schema<T>, data: RepositoryInputData<U, T>): boolean {
  const missingRequiredKeys = schema.requiredKeys?.filter(key => !Object.keys(data).includes(key));
  if(missingRequiredKeys.length > 0) {
    throw new HalenError('INVALID_CREATE_DATA', `\n Missing required keys: ${missingRequiredKeys.join(', ')}`);
  }

  if(!validateRepositoryDataTypes(schema, data)) throw new HalenError('INVALID_CREATE_DATA');

  return true;
}
function validateRepositoryDataTypes<T extends SchemaObject, U extends SchemaInferType<T>>(
  schema: Schema<T>,
  data: RepositoryInputData<U, T>
): boolean {
  const result: boolean[] = [];

  for (const [key, value] of Object.entries(data)) {
    const literal = schema.object[key];
    
    if (isSchemaSubObject(literal)) {
      result.push(...validateSchemaSubObject(literal, value as SchemaSubObject));
    } else {
      result.push(literal.__validate__(value));
    }
  }

  return result.every(x => x);
}

function validateSchemaSubObject(schema: SchemaSubObject, data: SchemaSubObject): boolean[] {
  const result: boolean[] = [];

  for (const [key, value] of Object.entries(data)) {
    const literal = schema[key];
    
    if (isSchemaSubObject(literal)) {
      result.push(...validateSchemaSubObject(literal, value as SchemaSubObject));
    } else {
      result.push(literal.__validate__(value));
    }
  }

  return result;
}

export function validateRepositoryUpdateData<T extends SchemaObject, U extends SchemaInferType<T>>(schema: Schema<T>, data: RepositoryInputData<U, T>): boolean {
  if(!validateRepositoryDataTypes(schema, data)) throw new HalenError('INVALID_UPDATE_DATA');

  return true;
}