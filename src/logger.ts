import { Injectable } from "./decorators/injectable.decorator";
import { Logger } from "./interfaces/logger.interface";

@Injectable()
export class DefaultLogger implements Logger {
  private readonly name: string;
  constructor() {
    this.name = this.constructor.name;
  }
  public debug(...message: any[]) {
    this._console("debug", message);
  }
  public error(...message: any[]) {
    this._console("error", message);
  }
  public log(...message: any[]) {
    this._console("log", message);
  }
  public warn(...message: any[]) {
    this._console("warn", message);
  }

  private _console(method: string, message: any[]) {
    console[method](
      new Date().toISOString(),
      `[${method.toUpperCase()}] --`,
      `[${this.name}]`,
      ...message,
    );
  }
}
