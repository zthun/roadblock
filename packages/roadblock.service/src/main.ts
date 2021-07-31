#!/usr/bin/env node

import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ZRoadblockTokensController } from './tokens/tokens.controller';

/**
 * The main module for the service.
 */
@Module({
  controllers: [ZRoadblockTokensController]
})
class ZRoadblockServiceModule {
  /**
   * Runs the microservice.
   *
   * @returns A promise that will run the application.
   */
  public static async run() {
    const host = '0.0.0.0';
    const port = 8080;
    const transport = Transport.TCP;
    const options = { host, port };

    const app = await NestFactory.createMicroservice(ZRoadblockServiceModule, { transport, options });
    await app.listen();
  }
}

ZRoadblockServiceModule.run();
