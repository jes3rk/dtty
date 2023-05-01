export const SetMetadata =
  (key: string, value: any): ClassDecorator & MethodDecorator =>
  (
    target: object,
    _?: string,
    descriptor?: TypedPropertyDescriptor<unknown>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value);
    } else {
      Reflect.defineMetadata(key, value, target);
    }
  };
