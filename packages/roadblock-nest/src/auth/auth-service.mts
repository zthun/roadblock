import type { IncomingMessage, ServerResponse } from "node:http";

import type { ZNullable } from "@zthun/helpful-fn";
import type { IZIdentity } from "@zthun/roadblock-domain";
import type { Request } from "express";

export const ZRoadblockAuthServiceToken = Symbol("ZRoadblockAuthServiceToken");

/**
 * Configures options for creating a better auth session.
 */
export interface IZRoadblockAuthServiceOptions {
  /**
   * The secret used to sign and encrypt authentication data.
   */
  secret?: string;

  /**
   * The list of domains to trust.
   *
   * Domains, 127.0.0.1 and localhost are always trusted.
   *
   * This trusts the root domain, subdomains, and all ports.
   */
  domains?: string[];
}

export interface IZRoadblockAuthService {
  get nodeHandler(): (
    req: IncomingMessage,
    res: ServerResponse,
  ) => Promise<void>;

  getIdentity(req: Request): Promise<ZNullable<IZIdentity>>;
}
