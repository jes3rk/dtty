import {
  ApplyMiddleware,
  Controller,
  DittyMiddleware,
  Get,
  Injectable,
  IttyRequest,
  Request,
} from "../src";

type MiddlewareTest = IttyRequest & { middlewareTest: MiddlewareTestingDto };

@Injectable()
export class GlobalMiddleware implements DittyMiddleware {
  public apply(req: MiddlewareTest): void | Promise<void> {
    if (!req.middlewareTest) req.middlewareTest = new MiddlewareTestingDto();
    req.middlewareTest.usedGlobalMiddleware = true;
  }
}

@Injectable()
class ClassMiddleware implements DittyMiddleware {
  public apply(req: MiddlewareTest): void | Promise<void> {
    if (!req.middlewareTest) req.middlewareTest = new MiddlewareTestingDto();
    req.middlewareTest.usedClassMiddleware = true;
  }
}

@Injectable()
class MethodMiddleware implements DittyMiddleware {
  public apply(req: MiddlewareTest): void | Promise<void> {
    if (!req.middlewareTest) req.middlewareTest = new MiddlewareTestingDto();
    req.middlewareTest.usedMethodMiddleware = true;
  }
}

export class MiddlewareTestingDto {
  public usedGlobalMiddleware: boolean;
  public usedMethodMiddleware: boolean;
  public usedClassMiddleware: boolean;

  constructor() {
    this.usedClassMiddleware = false;
    this.usedGlobalMiddleware = false;
    this.usedMethodMiddleware = false;
  }
}

@Controller("/middleware")
@ApplyMiddleware(ClassMiddleware)
export class MiddlewareTestingController {
  @Get("/classMiddleware")
  public classMiddleware(@Request() req: MiddlewareTest): MiddlewareTestingDto {
    return req.middlewareTest;
  }

  @Get("/classMiddleware/methodMiddleware")
  @ApplyMiddleware(MethodMiddleware)
  public methodMiddleware(
    @Request() req: MiddlewareTest,
  ): MiddlewareTestingDto {
    return req.middlewareTest;
  }
}

@Controller("/middleware")
export class GlobalMiddlewareTestingController {
  @Get("/")
  public globalMiddleare(@Request() req: MiddlewareTest): MiddlewareTestingDto {
    return req.middlewareTest;
  }
}
