# dtty

Dependency Injection + Itty Router = dtty.

Web framework for Cloudflare workers inspired by NestJS.

## Initialization

To use Dtty, simply create a new instance and let it handle all incoming requests.

```ts
// index.ts
const app = new Dtty();

export default {
  async fetch(
    request: Request,
    env?: Record<string, any>,
    ctx?: ExecutionContext,
  ): Promise<Response> {
    return app.handle(request, env, ctx);
  },
};
```

## Routing

Controllers are registered through the `Dtty.registerControllers` method. This handles the mapping of routes and application of controller level and method level middleware.

```ts
@Controller("/route")
class RouteController {
  @Get("/")
  handleGet() {}

  @Post("/")
  handlePost() {}

  @Put("/")
  handlePut() {}

  @Delete("/")
  handleDelete() {}
}

/* ----- */
app.registerControllers(
  // Array of controller classes
  RouteController,
);
```

### Route params

Route parameters can be injected into controller methods with the `@Param()` decorator which takes an optional string to inject an individual parameter as opposed to all the parameters.

Optionally, the `@Param()` decorator takes a second parameter that to parse and validate the parameter. For example, if an endpoint expects an `id` parameter of type `number` (e.g `/request/1234`), the included `IntegerTransformer` will automatically validate that the parameter is an integer and will transform the string into an integer before supplying it to the controller handler.

```ts
@Get('/route/:id')
getRouteById(@Param("id") id: string) {}

@Get('/route/:id')
getRouteByNumberId(@Param("id", IntegerTransformer) id: number) {}
```

### Query Params

Much like route parameters, query parameters can be injected into the controller with the `@Query()` decorator. The decorator takes a configuration object to inject either an individual parameter or all the parameters with optional transformation and validation.

When working with `esbuild`, some of the metadata that typescript emits and `class-transformer` relies upon is missing. Therefore, all class properties should be decorated with the `@Type` decorator to manually specify the type of the field.

```ts
  @Get('/named')
  handleNamedParam(@Query({paramName: "test"}) value: string) {
    // maps the parameter named `test` out without transformation
  }

  @Get('/unnamed')
  handleUnnamed(@Query() values: Record<string, unknown>) {
    // maps all the query parameters out without transformation or validation
  }

  @Get('/named/transformed')
  handleNamedAndTransformed(@Query({paramName: "test", transformer: IntegerTransformer}) value: number) {
    // maps the parameter named `test` out and transforms into an integer
  }

  @Get('/unnamed/validated')
  handleUnnamedAndValidated(@Query({paramsType: QueryDto}) values: QueryDto) {
    // maps all the query parameters out and transforms and validates against a class definition
  }
```

### Body

The request body can be both validated and injected into controller methods via the `@Body()` decorator. This decorator optionally takes a class constructor to perform transformation and validation via [class-transformer](https://www.npmjs.com/package/class-transformer) and [class-validator](https://www.npmjs.com/package/class-validator) respectively.

```ts
@Put('/route/:id')
updateRouteById(@Param('id') id: string, @Body(UpdateRouteDto) body: UpdateRouteDto) {}
```

## Exception Handling

Exceptions thrown by an endpoint are caught at three levels:

- Method
- Controller
- Global

Dtty provides an interface called `ExceptionHandler` to define how classes can be used to catch and handle exceptions. The `HandleException` decorator optionally takes a parameter to filter exceptions by type to enable finer grained control over exception handling logic. For a given exception:

1. Evaluate any method level exception handlers for the specific exception type
2. Evaluate any un-filtered method level exception handlers
3. Evaluate any controller level exception handlers for the specific exception type
4. Evaluate any un-filtered controller level exception handlers
5. Evaluate any global level exception handlers for the specific exception type
6. Evaluate any un-filtered global level exception handlers

If no exception handlers are found, the application will return with code `500`.

```ts
@Controller()
@ApplyHandlers(ControllerExceptionHandler)
export class IndexController {
  @Get("")
  @ApplyHandlers(MethodExceptionHandler, GenericHandler)
  getIndex() {}
}
```

## Roadmap

- [x] Global middleware
- [x] Controller middleware
- [x] Route middleware
- [x] Global body transformer
- [x] Global body validator
- [x] Route param transformer / validator
- [x] Global exception handler
- [x] Controller exception handler
- [x] Route exception handler
- [x] URL query param mapper
- [x] URL query param transformer / validator
- [ ] Optimizations for tree shaking
