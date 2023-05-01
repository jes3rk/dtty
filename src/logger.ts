export class Logger {
  constructor() {
    console.log("Mount logger");
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
      ...message,
    );
  }
}
