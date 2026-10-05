import { IncomingMessage, ServerResponse } from "node:http";

import { Injectable } from "@nestjs/common";
import { ZNullable } from "@zthun/helpful-fn";
import { IZIdentity, ZIdentityBuilder } from "@zthun/roadblock-domain";
import { type Auth, betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { Request } from "express";
import { uniq } from "lodash-es";

import {
  IZRoadblockAuthService,
  IZRoadblockAuthServiceOptions,
} from "./auth-service.mjs";

@Injectable()
export class ZRoadblockAuthServiceBetter implements IZRoadblockAuthService {
  public static create({
    secret,
    domains = [],
  }: IZRoadblockAuthServiceOptions) {
    const trustedOrigins = uniq(["127.0.0.1", "localhost", ...domains]).flatMap(
      (d) => [
        // Root domains with protocols
        `http://${d}`,
        `https://${d}`,
        // Root domains with ports
        `http://${d}:*`,
        `https://${d}:*`,
        // All subdomains
        `http://*.${d}`,
        `https://*.${d}`,
        // All subdomains and ports
        `http://*.${d}:*`,
        `https://*.${d}:*`,
      ],
    );

    return betterAuth({
      secret,
      trustedOrigins,
      database: memoryAdapter({
        user: [],
        session: [],
        account: [],
        verification: [],
      }),
      emailAndPassword: { enabled: true },
    });
  }

  public get nodeHandler(): (
    req: IncomingMessage,
    res: ServerResponse,
  ) => Promise<void> {
    return toNodeHandler(this._auth);
  }

  public constructor(private _auth: Auth<any>) {}

  public async getIdentity(req: Request): Promise<ZNullable<IZIdentity>> {
    const session = await this._auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session == null) {
      return null;
    }

    const { user } = session;

    return new ZIdentityBuilder().email(user.email).id(user.id).build();
  }
}
