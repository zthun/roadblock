import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { ZRoadblockAppModule } from "./app/app-module.mjs";

void (async function () {
  const app = await NestFactory.create(ZRoadblockAppModule);
  app.setGlobalPrefix("api");

  app.use(helmet());

  await app.listen(3000);
})();
