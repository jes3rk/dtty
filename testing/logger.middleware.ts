import { Inject, Injectable } from "../src";
import { DittyMiddleware } from "../src/interfaces/middleware.interface";
import { Logger } from "../src/logger";
import { IttyRequest } from "../src/types";

@Injectable()
export class LoggerMiddleware implements DittyMiddleware {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  apply(req: IttyRequest): void | Promise<void> {
    this.logger.log(`Incoming on ${req.url}`);
  }
}
