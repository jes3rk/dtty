export interface DttyTransformer<T> {
  transform(body: any): T | Promise<T>;
}
