/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ZCookiesClient } from './cookies.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Cookies.Service',
        transport: Transport.TCP,
        options: {
          host: 'zthunworks-services-cookies',
          port: 4000
        }
      }
    ])
  ],
  providers: [ZCookiesClient],
  exports: [ZCookiesClient]
})
/**
 * Represents a module for handling notifications.
 */
export class ZCookiesModule {}
