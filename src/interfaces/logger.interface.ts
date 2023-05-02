export interface Logger {
  debug(...message: any[]): void;
  error(...message: any[]): void;
  log(...message: any[]): void;
  warn(...message: any[]): void;
}
