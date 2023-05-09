import { Injectable } from "../decorators/injectable.decorator";
import { ValidationException } from "../exceptions/validation.exception";
import { DttyTransformer } from "../interfaces/transformer.interface";

@Injectable()
export class IntegerTransformer implements DttyTransformer<number> {
  transform(body: any): number {
    const output = parseInt(body);
    if (isNaN(output))
      throw new ValidationException([
        {
          property: body,
          toString: () =>
            `Invalid parameter value. Expected number but received ${body}`,
        },
      ]);
    return output;
  }
}
