import { DttyRequest } from "../types";

export interface DttyMiddleware {
  apply(req: DttyRequest): void | Promise<void>;
}
