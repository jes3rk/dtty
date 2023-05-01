import { IttyRequest } from "src/types";

export interface DittyMiddleware {
  apply(req: IttyRequest): void | Promise<void>;
}
