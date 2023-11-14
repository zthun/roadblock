/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ZUsersClient } from './users.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Users.Service',
        transport: Transport.TCP,
        options: {
          host: 'zthunworks-services-users',
          port: 4000
        }
      }
    ])
  ],
  providers: [ZUsersClient],
  exports: [ZUsersClient]
})
/**
 * Represents the module that handles users.
 */
export class ZUsersModule {}
