/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ZRoadblockModule } from '@zthun/roadblock.core';
import { ZRoadblockTokensController } from './tokens/tokens.controller';

/**
 * The main module for the service.
 */
@Module({
  imports: [ZRoadblockModule],
  controllers: [ZRoadblockTokensController]
})
class ZRoadblockServerModule {
  /**
   * Runs the microservice.
   *
   * @returns A promise that will run the application.
   */
  public static async run() {
    const app = await NestFactory.create(ZRoadblockServerModule);
    app.setGlobalPrefix('api');
    await app.listen(8080).catch((err) => console.log(err));
  }
}

ZRoadblockServerModule.run();
