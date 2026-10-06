/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRoadblockAuthModule } from "@zthun/roadblock-nest";

@Module({
  imports: [
    ZRoadblockAuthModule.forRoot({
      secret:
        "be3b80ca78d78e51e29ee38a7e318023b512a3a5f65e478f56ab33d47a33abfd",
      domains: ["zthunworks.com", "roadblock-api"],
    }),
  ],
})
export class ZRoadblockAppModule {}
