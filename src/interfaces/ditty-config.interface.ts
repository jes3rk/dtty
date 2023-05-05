import { constructor } from "tsyringe/dist/typings/types";
import { Logger } from "./logger.interface";

export interface DttyConfig {
  /**
   * Specify the logger to use for the application
   */
  logger?: constructor<Logger>;
}
