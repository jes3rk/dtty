import { ValidationError } from "class-validator";

export class ValidationException extends Error {
  constructor(public readonly exceptions: ValidationError[]) {
    super();
    this.name = this.constructor.name;
  }
}
