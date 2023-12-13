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

export type SchemaValidatorLiteralType<T extends SchemaValidatorType> = T extends infer U
  ? U extends "string"
    ? string
    : U extends "number"
    ? number
    : U extends "boolean"
    ? boolean
    : U extends "array"
    ? Array<unknown>
    : U extends "object"
    ? object
    : never
  : never;

export abstract class SchemaLiteral<T extends SchemaValidatorType> {
  public type: T;
  public validator: SchemaValidator<T>;

  public _default?: SchemaValidatorLiteralType<T>;
  public _required: boolean = false;

  public constructor(type: T) {
    this.type = type;
    this.validator = new SchemaValidator(this.type);
  }

  protected validate(value: unknown): value is SchemaValidatorLiteralType<T> {
    return this.validator.validate(value);
  }

  public default(value: SchemaValidatorLiteralType<T>): this {
    this._default = value;

    return this;
  }

  public required(value: boolean = true): this {
    this._required = value;

    return this;
  }
}

export type SchemaObject = {
  [key: string]: SchemaLiteralsType | SchemaObject
} & { readonly id: SchemaLiteralsType };

export type SchemaLiteralsType = NumberLiteral | StringLiteral | BooleanLiteral | ArrayLiteral | ObjectLiteral;

export type SchemaInferType<T extends SchemaObject> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends SchemaLiteralsType
      ? SchemaValidatorLiteralType<U["type"]>
      : U extends SchemaObject
        ? SchemaInferType<U>
        : never
    : never;
};

export type SchemaData = {
  [key: string]: unknown;
}