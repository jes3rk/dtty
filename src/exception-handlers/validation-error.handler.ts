import { HandleException } from "../decorators/handle-exception.decorator";
import { ValidationException } from "../exceptions/validation.exception";
import { ExceptionHandler } from "../interfaces/exception-handler.interface";
import { RouterResponse } from "../types";

@HandleException(ValidationException)
export class ValidationExceptionHandler
  implements ExceptionHandler<ValidationException>
{
  handle(err: ValidationException): RouterResponse {
    return {
      data: err.exceptions,
      status: 400,
    };
  }
}
