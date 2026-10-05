import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

import {
  type IZRoadblockAuthService,
  ZRoadblockAuthServiceToken,
} from "./auth-service.mjs";

/**
 * A global guard that checks your authentication.
 */
@Injectable()
export class ZRoadblockAuthGuard implements CanActivate {
  public constructor(
    @Inject(ZRoadblockAuthServiceToken)
    private readonly auth: IZRoadblockAuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const identity = await this.auth.getIdentity(request);

    if (!identity) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
