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

# 基本使用

# 几个重要的概念

# Controllers

***Controllers are responsible for handling incoming requests and returning responses to the client.***

# Providers(services)

Basically, almost everything may be considered as a provider – service, repository, factory, helper, and so on. All of them can inject dependencies through constructor, meaning, they can create various relationships with each other. But in fact, a provider is nothing else than ***just a simple class annotated with an `@Injectable()` decorator***.

# Modules

A module is a class annotated with a `@Module()` decorator. The `@Module()` decorator provides metadata that Nest makes use of to ***organize the application structure***