import { RouterResponse } from "../types";

export interface ExceptionHandler<T extends Error = Error> {
  handle(err: T): RouterResponse | Promise<RouterResponse>;
}
