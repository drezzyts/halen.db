import { SchemaLiteral } from "../../types/schema";

export default class ObjectLiteral extends SchemaLiteral<'object'> {
  #maxProperties?: number;
  #minProperties?: number;

  public constructor() {
      super('object');
  }

  maxProperties(max: number): this {
    this.#maxProperties = max;
    return this;
  }

  minProperties(min: number): this {
    this.#minProperties = min;
    return this;
  }

  public __validate__(value: unknown): value is object {
      if(!super.validate(value)) return false;

      if(this.#maxProperties && Object.keys(value).length > this.#maxProperties) return false;
      if(this.#minProperties && Object.keys(value).length < this.#minProperties) return false;

      return true;
  }
}