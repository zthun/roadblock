import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ZRoadblockTokensServiceProxy } from './tokens/tokens.proxy';

export const ROADBLOCK_HOST = 'roadblock-service';
export const ROADBLOCK_PORT = 8080;

@Module({
  imports: [],
  providers: [
    {
      provide: ZRoadblockTokensServiceProxy.INJECTION_TOKEN,
      useFactory: () => ClientProxyFactory.create({ options: { host: ROADBLOCK_HOST, port: ROADBLOCK_PORT } })
    },
    ZRoadblockTokensServiceProxy
  ],
  exports: [ZRoadblockTokensServiceProxy]
})
/**
 * Represents the the roadblock module.
 */
export class ZRoadblockModule {}
