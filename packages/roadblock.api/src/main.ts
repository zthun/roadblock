/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ZHealthModule, ZNestApplication } from '@zthun/works.nest';
import { ZAuthModule } from './auth/auth.module';

@Module({
  imports: [ZHealthModule, ZAuthModule]
})
/**
 * The main module.
 */
export class ZRoadblockMainModule {}

ZNestApplication.create(ZRoadblockMainModule).then((app) => ZNestApplication.run(app));
