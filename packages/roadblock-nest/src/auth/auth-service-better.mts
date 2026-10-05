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
    const _protocols = ["http", "https"];
    const _domains = uniq(["127.0.0.1", "localhost", ...domains]);

    const allowedHosts = _domains.flatMap((d) => [
      d,
      `${d}:*`,
      `*.${d}`,
      `*.${d}:*`,
    ]);

    const trustedOrigins = _domains.flatMap((d) => {
      return _protocols.flatMap((p) => [
        // Root domain
        `${p}://${d}`,
        // Root domain with ports
        `${p}://${d}:*`,
        // Subdomains
        `${p}://*.${d}`,
        // Subdomains with ports
        `${p}://*.${d}:*`,
      ]);
    });

    return betterAuth({
      secret,
      baseURL: { allowedHosts, protocol: "auto" },
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
