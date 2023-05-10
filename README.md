# dtty

Dependency Injection + Itty Router = dtty.

Web framework for Cloudflare workers inspired by NestJS.

## Usage

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

### Routing

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

#### Route params

Route parameters can be injected into controller methods with the `@Param()` decorator which takes an optional string to inject an individual parameter as opposed to all the parameters.

Optionally, the `@Param()` decorator takes a second parameter that to parse and validate the parameter. For example, if an endpoint expects an `id` parameter of type `number` (e.g `/request/1234`), the included `IntegerTransformer` will automatically validate that the parameter is an integer and will transform the string into an integer before supplying it to the controller handler.

```ts
@Get('/route/:id')
getRouteById(@Param("id") id: string) {}

@Get('/route/:id')
getRouteByNumberId(@Param("id", IntegerTransformer) id: number) {}
```

#### Body

The request body can be both validated and injected into controller methods via the `@Body()` decorator. This decorator optionally takes a class constructor to perform transformation and validation via [class-transformer](https://www.npmjs.com/package/class-transformer) and [class-validator](https://www.npmjs.com/package/class-validator) respectively.

```ts
@Put('/route/:id')
updateRouteById(@Param('id') id: string, @Body(UpdateRouteDto) body: UpdateRouteDto) {}
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
- [ ] URL query param mapper
- [ ] URL query param transformer / validator
- [ ] Optimizations for tree shaking
