import type { DynamicModule, NestModule } from "@nestjs/common";
import { Inject, Module } from "@nestjs/common";
import { APP_GUARD, HttpAdapterHost } from "@nestjs/core";
import { json, urlencoded } from "express";

import { ZRoadblockAuthGuard } from "./auth-guard.mjs";
import {
  type IZRoadblockAuthService,
  IZRoadblockAuthServiceOptions,
  ZRoadblockAuthServiceToken,
} from "./auth-service.mjs";
import { ZRoadblockAuthServiceBetter } from "./auth-service-better.mjs";

@Module({})
export class ZRoadblockAuthModule implements NestModule {
  public constructor(
    @Inject(ZRoadblockAuthServiceToken)
    private readonly auth: IZRoadblockAuthService,
    @Inject(HttpAdapterHost)
    private readonly http: HttpAdapterHost,
  ) {}

  /**
   * Creates the shared authentication service and registers its global guard.
   *
   * @param options -
   *        The Better Auth configuration, including a required secret.
   *
   * @returns
   *        The authentication module to import once in the root app module.
   */
  public static forRoot(options: IZRoadblockAuthServiceOptions): DynamicModule {
    return {
      module: ZRoadblockAuthModule,
      global: true,
      providers: [
        {
          provide: ZRoadblockAuthServiceToken,
          useFactory: () => {
            const auth = ZRoadblockAuthServiceBetter.create(options);
            return new ZRoadblockAuthServiceBetter(auth);
          },
        },
        { provide: APP_GUARD, useClass: ZRoadblockAuthGuard },
      ],
      exports: [ZRoadblockAuthServiceToken],
    };
  }

  public configure() {
    const adapter = this.http.httpAdapter;
    adapter.getInstance().all(`/api/auth/{*path}`, this.auth.nodeHandler);
    adapter.use(json());
    adapter.use(urlencoded({ extended: true }));
  }
}
