import { SchemaLiteral, SchemaValidatorType } from "../../types/schema";

export default class NumberLiteral extends SchemaLiteral<'number'> {
  #max?: number;
  #min?: number;

  public constructor() {
    super('number');
  }

  public max(max: number): this {
    this.#max = max;
    return this;
  }

  public min(min: number): this {
    this.#min = min;
    return this;
  }

  public range(min: number, max: number): this {
    this.max(max);
    this.min(min);
    return this;
  }

  public __validate__(value: unknown): value is number {
    if(!super.validate(value)) return false;

    if(this.#max && value > this.#max) return false;
    if(this.#min && value < this.#min) return false;
    
    return true;
  }
}