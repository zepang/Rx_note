# Nestjs Learning

Preconditions：

* TypeScript
* Rxjs
* reflect-metadata

# reflect-metadata 

大概看了一下源码，主要是用来存取数据，最外层用是WeakMap，里边都是Map。nestjs里边很多地方都用了这个，我想大概是为了全局有个地方用来存取这些元数据。

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