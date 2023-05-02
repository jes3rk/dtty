import {
  DittyMiddleware,
  Inject,
  Injectable,
  IttyRequest,
  LOGGER_TOKEN,
  Logger,
} from "../src";

@Injectable()
export class LoggerMiddleware implements DittyMiddleware {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: Logger) {}

  apply(req: IttyRequest): void | Promise<void> {
    this.logger.log(`Incoming on ${req.url}`);
  }
}
