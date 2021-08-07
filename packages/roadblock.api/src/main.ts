/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

/**
 * The main module for the service.
 */
@Module({})
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
