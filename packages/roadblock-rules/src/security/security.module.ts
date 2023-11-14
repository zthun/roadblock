/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ZVaultModule } from '@zthun/vault-client';
import { ZCookiesModule, ZUsersModule } from '@zthun/works.microservices';
import { ZSecurityController } from './security.controller';
import { ZSecurityService } from './security.service';

@Module({
  imports: [ZVaultModule, ZUsersModule, ZCookiesModule],
  controllers: [ZSecurityController],
  providers: [ZSecurityService],
  exports: [ZSecurityService]
})
/**
 * Represents a module that includes all services to extract the cookie token.
 */
export class ZSecurityModule {}
