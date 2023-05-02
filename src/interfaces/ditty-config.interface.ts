import { constructor } from "tsyringe/dist/typings/types";
import { Logger } from "./logger.interface";

export interface DittyConfig {
  /**
   * Specify the logger to use for the application
   */
  logger?: constructor<Logger>;
}
