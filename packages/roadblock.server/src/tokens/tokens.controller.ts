import { Controller, Get, Post } from '@nestjs/common';
import { ZRoadblockTokensServiceProxy } from '@zthun/roadblock.core';

@Controller('tokens')
/**
 * The controller for constructing and verifying user tokens
 */
export class ZRoadblockTokensController {
  /**
   * Initializes a new instance of this object.
   *
   * @param _tokens The token service proxy.
   */
  public constructor(private _tokens: ZRoadblockTokensServiceProxy) {}

  /**
   * Convenience method for UIs that want route guards for token auth.
   *
   * Returns a status of 204 if your cookie token is valid, and 401 if not authenticated.
   *
   * @param res The http response object.  This will receive the 204 status.
   *
   * @returns A Promise that resolves to a status of 204 if the cookie token is valid, and 401 if it is not authenticated.
   */
  @Get()
  public async verify() {
    return this._tokens.verify('ABCD');
  }

  /**
   * Logs the user into the system.
   *
   * @param res The response object.
   * @param credentials The user credentials.
   *
   * @returns A promise that resolves to a status of 204 if the cookie token is valid, and 401 if the user cannot login.
   */
  @Post()
  public async create() {
    return this._tokens.create();
  }
}
