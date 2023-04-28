import { RouterType } from "itty-router";
import { Token } from "typedi";

export const ROUTER_TOKEN = new Token<RouterType>("__router__");
