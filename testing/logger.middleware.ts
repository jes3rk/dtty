import {
  DittyMiddleware,
  DittyRequest,
  Inject,
  Injectable,
  LOGGER_TOKEN,
  Logger,
} from "../src";

@Injectable()
export class LoggerMiddleware implements DittyMiddleware {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: Logger) {}

  apply(req: DittyRequest): void | Promise<void> {
    this.logger.log(`Incoming on ${req.url}`);
  }
}
