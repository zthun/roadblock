import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
/**
 * The controller for logging the user in and out.
 */
export class ZRoadblockTokensController {
  /**
   * Convenience method for UIs that want route guards for token auth.
   *
   * Returns a status of 204 if your cookie token is valid, and 401 if not authenticated.
   *
   * @param res The http response object.  This will receive the 204 status.
   *
   * @returns A Promise that resolves to a status of 204 if the cookie token is valid, and 401 if it is not authenticated.
   */
  @MessagePattern({ cmd: 'verify' })
  public async verify() {
    console.log('got a verify message');
    return true;
  }

  /**
   * Logs the user into the system.
   *
   * @param res The response object.
   * @param credentials The user credentials.
   *
   * @returns A promise that resolves to a status of 204 if the cookie token is valid, and 401 if the user cannot login.
   */
  @MessagePattern({ cmd: 'create' })
  public async create() {
    console.log('got a create message');
    return null;
  }
}
