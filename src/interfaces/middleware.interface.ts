import { IttyRequest } from "../types";

export interface DittyMiddleware {
  apply(req: IttyRequest): void | Promise<void>;
}
