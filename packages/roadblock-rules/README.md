# Description

Zthunworks Nest services implement standard distributable services that can be reused across applications for
consistency.

## Installation

```sh
# NPM
npm install @zthun/works.nest
# Yarn
yarn add @zthun/works.nest
```

This package is divided into modules that automatically add specific http routes and services to your application
without you having to add additional implementation. This package is built around the [nestjs](https://nestjs.com/)
framework.

## Health Module

![Health](images/png/works.nest.health.png)

The health module is used to add a basic health check to your application.

```ts
import { ZHealthModule } from '@zthun/works.nest';

@Module({
  imports: [ZHealthModule]
})
export class MyApp {}
```

The following is the route that gets added.

```ts
/**
 * Returns a 200 return code.
 */
@Get('health')
```
