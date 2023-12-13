import { SchemaLiteral } from "../../types/schema";

export default class BooleanLiteral extends SchemaLiteral<'boolean'> {
  public constructor() {
    super('boolean');
  }

  public __validate__(value: unknown): value is boolean {
    return super.validate(value);
  }
}