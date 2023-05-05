import {
  DttyMiddleware,
  DttyRequest,
  Inject,
  Injectable,
  LOGGER_TOKEN,
  Logger,
} from "../src";

@Injectable()
export class LoggerMiddleware implements DttyMiddleware {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: Logger) {}

  apply(req: DttyRequest): void | Promise<void> {
    this.logger.log(`Incoming on ${req.url}`);
  }
}
