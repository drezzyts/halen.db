import { SchemaLiteral, SchemaValidatorLiteralType, SchemaValidatorType } from "../../types/schema";
import { SchemaValidator } from "../SchemaValidator";

export default class ArrayLiteral<U extends SchemaValidatorType | unknown> extends SchemaLiteral<'array'> {
  #type?: SchemaValidatorType;
  #maxItems?: number;
  #minItems?: number;

  public constructor () {
    super('array');
  }

  public maxItems(max: number): this {
    this.#maxItems = max;
    return this;
  }

  public minItems(min: number): this {
    this.#minItems = min;
    return this;
  }

  public range(min: number, max: number): this {
    this.maxItems(max);
    this.minItems(min);
    return this;
  }

  public of<T extends SchemaValidatorType>(type: T): ArrayLiteral<T> {
    this.#type = type;
    const array = new ArrayLiteral<T>();
    Object.setPrototypeOf(array, this);

    return array;
  }

  public __validate__(value: unknown): value is unknown[] {
    if(!super.validate(value)) return false;

    if(this.#maxItems && value.length > this.#maxItems) return false;
    if(this.#minItems && value.length < this.#minItems) return false;

    if(this.#type && !this.allItemsAreOfType(value, this.#type)) return false;

    return true;
  }

  private allItemsAreOfType(value: unknown[], type: SchemaValidatorType): boolean {
    const validator = new SchemaValidator(type);
    return value.every(item => validator.validate(item));
  }
}