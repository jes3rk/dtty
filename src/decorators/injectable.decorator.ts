import { injectable, singleton } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { Scope } from "../constants";

export const Injectable =
  (params: { scope?: Scope } = {}) =>
  (target: constructor<unknown>) => {
    const { scope = Scope.Singleton } = params;
    switch (scope) {
      case Scope.Singleton:
        return singleton()(target);
      case Scope.Transient:
        return injectable()(target);
      default:
        throw new Error("Invalid Scope");
    }
  };
