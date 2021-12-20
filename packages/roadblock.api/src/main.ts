/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ZCookiesModule, ZNotificationsModule, ZUsersModule } from '@zthun/works.microservices';
import { ZConfigModule, ZHealthModule, ZNestApplication, ZOptionsModule, ZSecurityModule } from '@zthun/works.nest';
import { ZProfilesController } from './profile/profiles.controller';
import { ZProfilesService } from './profile/profiles.service';
import { ZTokensController } from './tokens/tokens.controller';
import { ZTokensService } from './tokens/tokens.service';

@Module({
  imports: [ZHealthModule, ZOptionsModule, ZUsersModule, ZNotificationsModule, ZConfigModule, ZCookiesModule, ZSecurityModule],
  providers: [ZTokensService, ZProfilesService],
  controllers: [ZTokensController, ZProfilesController],
  exports: [ZTokensService]
})
/**
 * The main module.
 */
export class ZRoadblockMainModule {}

ZNestApplication.create(ZRoadblockMainModule).then((app) => ZNestApplication.run(app));
