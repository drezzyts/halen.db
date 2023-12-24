import { SchemaValidator } from "../structs/SchemaValidator";
import ArrayLiteral from "../structs/literals/ArrayLiteral";
import BooleanLiteral from "../structs/literals/BooleanLiteral";
import NumberLiteral from "../structs/literals/NumberLiteral";
import ObjectLiteral from "../structs/literals/ObjectLiteral";
import StringLiteral from "../structs/literals/StringLiteral";

export type SchemaValidatorType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "object";

export type SchemaValidatorLiteralType<T extends SchemaValidatorType, S> = T extends infer U
  ? U extends "string"
    ? string
    : U extends "number"
    ? number
    : U extends "boolean"
    ? boolean
    : U extends "array"
    ? Array<S>
    : U extends "object"
    ? object
    : never
  : never;

export abstract class SchemaLiteral<T extends SchemaValidatorType> {
  public type: T;
  public validator: SchemaValidator<T>;

  public _default?: SchemaValidatorLiteralType<T, unknown> | null = null;
  public _required: boolean = false;

  public constructor(type: T) {
    this.type = type;
    this.validator = new SchemaValidator(this.type);
  }

  protected validate(value: unknown): value is SchemaValidatorLiteralType<T, unknown> {
    return this.validator.validate(value);
  }

  public default(value: SchemaValidatorLiteralType<T, unknown>): this {
    this._default = value;

    return this;
  }

  public required(): this & { _required: true } {
    this._required = true;

    return this as this & { _required: true };
  }
}

export type SchemaObject = {
  [key: string]: SchemaLiteralsType | SchemaSubObject
} & { id: SchemaLiteralsType };

export type SchemaSubObject = {
  [keyof: string]: SchemaLiteralsType | SchemaSubObject;
}

export type SchemaLiteralsType = NumberLiteral | StringLiteral | BooleanLiteral | ArrayLiteral<unknown> | ObjectLiteral;

export type SchemaInferType<T extends SchemaObject | SchemaSubObject> = {
  [K in keyof T as T[K] extends SchemaRequiredProperty ? never : K]+?: T[K] extends infer U
    ? U extends SchemaLiteralsType
      ? U extends ArrayLiteral<infer V extends SchemaValidatorType> ? SchemaValidatorLiteralType<U["type"], SchemaValidatorLiteralType<V, unknown>> : SchemaValidatorLiteralType<U["type"], unknown>
      : U extends SchemaSubObject
        ? SchemaInferType<U>
        : never
    : never 
} & {
  [K in keyof T as T[K] extends SchemaRequiredProperty ? K : never]-?: T[K] extends infer U
    ? U extends SchemaLiteralsType
      ? U extends ArrayLiteral<infer V extends SchemaValidatorType> ? SchemaValidatorLiteralType<U["type"], SchemaValidatorLiteralType<V, unknown>> : SchemaValidatorLiteralType<U["type"], unknown>
      : U extends SchemaSubObject
        ? SchemaInferType<U>
        : never
      : never
} & {
  id: T['id'] & { _required: true };
}

export type SchemaRequiredProperty = {
  _required: true;
}
export type SchemaData = {
  [key: string]: unknown;
}