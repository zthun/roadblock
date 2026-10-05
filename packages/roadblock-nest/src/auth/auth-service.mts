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
}

export interface IZRoadblockAuthService {
  get nodeHandler(): (
    req: IncomingMessage,
    res: ServerResponse,
  ) => Promise<void>;

  getIdentity(req: Request): Promise<ZNullable<IZIdentity>>;
}
