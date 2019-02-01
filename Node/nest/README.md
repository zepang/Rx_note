# Nestjs Learning

Preconditions：

* TypeScript
* Rxjs
* reflect-metadata

# Setup
Setting up a new project is quite simple with Nest CLI. With npm installed, we can create a new Nestjs project with the following command
```
npm i -g @nestjs/cli
nest new project-name
```

The project directory will be scaffolded with serveral core files being located within a `src/` directory.

```
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

Following the convention, newly created modules should have their dedicated directory.

|           |                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------ |
| `main.ts` | The entry file of the application. It uses `NestFactory` to create the Nest application instance. |
| `app.module.ts` | Defines `AppModule`, the root module of the application.|
| `app.controller.ts` | Basic controllelr sample with a single route.|
| | |