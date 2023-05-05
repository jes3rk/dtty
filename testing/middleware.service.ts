import { Injectable } from "../src";
import { MiddlewareTest, MiddlewareTestingDto } from "./middleware.controller";

@Injectable()
export class MiddlewareService {
  public mapMiddlewareTest(req: MiddlewareTest): MiddlewareTestingDto {
    return req.middlewareTest;
  }
}
