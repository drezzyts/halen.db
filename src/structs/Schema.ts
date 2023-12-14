import { SchemaData, SchemaObject } from "../types/schema";
import ArrayLiteral from "./literals/ArrayLiteral";
import BooleanLiteral from "./literals/BooleanLiteral";
import NumberLiteral from "./literals/NumberLiteral";
import ObjectLiteral from "./literals/ObjectLiteral";
import StringLiteral from "./literals/StringLiteral";

export class Schema<T extends SchemaObject> {
  public defaultObject: SchemaData;
  public requiredKeys: string[];

  public static create<S extends SchemaObject>(object: S) {
    return new Schema(object);
  }

  private constructor(public object: T) {
    this.defaultObject = Object.entries(object)
      .filter(([key, value]) => value._default !== null && key !== 'id')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value._default }), {})

    this.requiredKeys = Object.entries(object)
      .filter(([, value]) => value._required)
      .map(([key]) => key)
      .concat('id');
  }

  public static number = () => new NumberLiteral();
  public static string = () => new StringLiteral();
  public static boolean = () => new BooleanLiteral();
  public static array = () => new ArrayLiteral();
  public static object = () => new ObjectLiteral();
}
