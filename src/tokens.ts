import { RouterType } from "itty-router";
import { Token } from "typedi";
import { Logger } from "./logger";
import { ContainerRef } from "./types";

export const CONTAINER_REF = new Token<ContainerRef>("__container-ref__");
export const LOGGER_TOKEN = new Token<Logger>("__logger__");
export const ROUTER_TOKEN = new Token<RouterType>("__router__");
