import { isUUID } from "class-validator";
import { Injectable } from "../decorators/injectable.decorator";
import { ValidationException } from "../exceptions/validation.exception";
import { DttyTransformer } from "../interfaces/transformer.interface";

/**
 * Transform and validate a string as a UUID
 */
@Injectable()
export class UuidTransformer implements DttyTransformer<string> {
  transform(body: any): string {
    if (!isUUID(body))
      throw new ValidationException([
        {
          property: "parameter",
          value: body,
        },
      ]);
    return body;
  }
}
