import {
  ApplyMiddleware,
  Controller,
  DttyMiddleware,
  DttyRequest,
  Get,
  Inject,
  Injectable,
  Request,
} from "../src";
import { MiddlewareService } from "./middleware.service";

export type MiddlewareTest = DttyRequest & {
  middlewareTest: MiddlewareTestingDto;
};

@Injectable()
export class GlobalMiddleware implements DttyMiddleware {
  public apply(req: MiddlewareTest): void | Promise<void> {
    if (!req.middlewareTest) req.middlewareTest = new MiddlewareTestingDto();
    req.middlewareTest.usedGlobalMiddleware = true;
  }
}

@Injectable()
class ClassMiddleware implements DttyMiddleware {
  public apply(req: MiddlewareTest): void | Promise<void> {
    if (!req.middlewareTest) req.middlewareTest = new MiddlewareTestingDto();
    req.middlewareTest.usedClassMiddleware = true;
  }
}

@Injectable()
class MethodMiddleware implements DttyMiddleware {
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
  constructor(
    @Inject(MiddlewareService) private readonly service: MiddlewareService,
  ) {}

  @Get("/classMiddleware")
  public classMiddleware(@Request() req: MiddlewareTest): MiddlewareTestingDto {
    return this.service.mapMiddlewareTest(req);
  }

  @Get("/classMiddleware/methodMiddleware")
  @ApplyMiddleware(MethodMiddleware)
  public methodMiddleware(
    @Request() req: MiddlewareTest,
  ): MiddlewareTestingDto {
    return this.service.mapMiddlewareTest(req);
  }
}

@Controller("/middleware")
export class GlobalMiddlewareTestingController {
  constructor(
    @Inject(MiddlewareService) private readonly service: MiddlewareService,
  ) {}

  @Get("/")
  public globalMiddleware(
    @Request() req: MiddlewareTest,
  ): MiddlewareTestingDto {
    return this.service.mapMiddlewareTest(req);
  }
}
