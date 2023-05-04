export interface DittyTransformer<T> {
  transform(body: any): T | Promise<T>;
}
