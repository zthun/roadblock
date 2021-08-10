/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ZHealthModule, ZNestApplication } from '@zthun/works.nest';

@Module({
  imports: [ZHealthModule]
})
/**
 * The main module.
 */
export class ZRoadblockMainModule {}

ZNestApplication.create(ZRoadblockMainModule).then((app) => ZNestApplication.run(app));
