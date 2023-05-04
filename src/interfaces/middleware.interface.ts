import { DittyRequest } from "../types";

export interface DittyMiddleware {
  apply(req: DittyRequest): void | Promise<void>;
}
