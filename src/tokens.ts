import { RouterType } from "itty-router";
import { Token } from "typedi";
import { Logger } from "./logger";

export const LOGGER_TOKEN = new Token<Logger>("__logger__");
export const ROUTER_TOKEN = new Token<RouterType>("__router__");
