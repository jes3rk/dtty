import { IttyRequest } from "src/types";
import { DittyMiddleware } from "../src/interfaces/middleware.interface";
import { Logger } from "../src/logger";

export class LoggerMiddleware implements DittyMiddleware {
  constructor(private readonly logger: Logger) {}

  apply(req: IttyRequest): void | Promise<void> {
    this.logger.log(`Incoming on ${req.url}`);
  }
}
