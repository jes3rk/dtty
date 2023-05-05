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

```ts
@Get('/route/:id')
getRouteById(@Param("id") id: string) {}
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
- [ ] Route param transformer / validator
- [x] Global exception handler
- [ ] Controller exception handler
- [ ] Route exception handler
- [ ] URL query param mapper
- [ ] URL query param transformer / validator
- [ ] Optimizations for tree shaking
