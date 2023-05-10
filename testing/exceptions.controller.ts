import {
  ApplyHandlers,
  Controller,
  ExceptionHandler,
  Get,
  HandleException,
  RouterResponse,
} from "../src";

class MethodException extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

class ControllerException extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

class GlobalException extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

@HandleException(MethodException)
class MethodExceptionHandler implements ExceptionHandler<MethodException> {
  handle(
    _: MethodException,
  ): RouterResponse<any> | Promise<RouterResponse<any>> {
    return {
      status: 500,
      data: {
        handler: "MethodExceptionHandler",
      },
    };
  }
}

@HandleException()
export class GenericHandler implements ExceptionHandler {
  handle(err: Error): RouterResponse<any> | Promise<RouterResponse<any>> {
    return {
      status: 500,
      data: {
        handler: "GenericHandler",
        exception: err.name,
      },
    };
  }
}

@Controller("/exceptions")
@ApplyHandlers(GenericHandler)
export class ExceptionsController {
  @Get("/method/specific")
  @ApplyHandlers(MethodExceptionHandler, GenericHandler)
  specificMethod() {
    throw new MethodException();
  }

  @Get("/method/generic")
  @ApplyHandlers(GenericHandler)
  genericMethod() {
    throw new MethodException();
  }

  @Get("/controller")
  controllerException() {
    throw new ControllerException();
  }
}

@Controller("/exceptions")
export class GlobalExceptionsController {
  @Get("/global")
  handleGlobal() {
    throw new GlobalException();
  }
}
