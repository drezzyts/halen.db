import { SchemaLiteral } from "../../types/schema";

export default class StringLiteral extends SchemaLiteral<'string'> {
  #maxLength?: number;
  #minLength?: number;

  public constructor() {
    super('string');
  }

  public maxLength(max: number): this {
    this.#maxLength = max;
    return this;
  }

  public minLength(min: number): this {
    this.#minLength = min;
    return this;
  }

  public lengthInRange(min: number, max: number): this {
    this.maxLength(max);
    this.minLength(min);
    return this;
  }

  public __validate__(value: unknown): value is string {
    if(!super.validate(value)) return false;

    if(this.#maxLength && value.length > this.#maxLength) return false;
    if(this.#minLength && value.length < this.#minLength) return false;

    return true;
  }
}