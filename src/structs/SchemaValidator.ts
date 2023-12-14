import { isArray, isObject } from "../functions/validators";
import {
  SchemaValidatorLiteralType,
  SchemaValidatorType,
} from "../types/schema";

export class SchemaValidator<T extends SchemaValidatorType> {
  public constructor(public type: T) {}
  
  public validate<U extends SchemaValidatorLiteralType<T, unknown>>(
    value: unknown
  ): value is U {
    switch(this.type) {
      case "string": return this.validateString(value as unknown);
      case "number": return this.validateNumber(value as unknown);
      case "boolean": return this.validateBoolean(value as unknown);
      case "object": {
        if(this.type == 'array') return this.validateArray(value as unknown[])
        return this.validateObject(value as unknown);
      } 
      default: return false;
    }
  }

  private validateString(value: unknown): value is string {
    return typeof value === 'string';
  }

  private validateNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  private validateObject(value: unknown): value is object {
    return isObject(value);
  }

  private validateArray(value: unknown[]): value is Array<unknown> {
    return isArray(value);
  }

  private validateBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }
}
