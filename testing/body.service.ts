import { Injectable } from "../src";
import { BodyTestDto } from "./body.controller";

@Injectable()
export class BodyService {
  public mapBody(body: object | BodyTestDto) {
    return {
      bodyType: body.constructor.name,
    };
  }
}
