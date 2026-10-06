/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRoadblockAuthModule } from "@zthun/roadblock-nest";

const secret = process.env.ZTHUNWORKS_ROADBLOCK_SECRET;
const domains = process.env.ZTHUNWORKS_ROADBLOCK_DOMAINS?.split(",");

@Module({
  imports: [ZRoadblockAuthModule.forRoot({ secret, domains })],
})
export class ZRoadblockAppModule {}
