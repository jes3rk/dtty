import { injectable, singleton } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { Scope } from "../constants";

/**
 * Mark a class as injectable within the
 * framework and optionally define creation
 * scope of the class.
 *
 * Defaults to `Scope.Singleton`
 */
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
