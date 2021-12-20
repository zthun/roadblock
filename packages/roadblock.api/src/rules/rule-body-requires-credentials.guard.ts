import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { IZLogin, ZAssert, ZLoginBuilder } from '@zthun/works.core';
import { ZUsersClient } from '@zthun/works.microservices';

@Injectable()
/**
 * Represents a rule that the request body requires the email and password credentials.
 */
export class ZRuleBodyRequiresCredentials implements CanActivate {
  /**
   * Initializes a new instance of this object.
   *
   * @param _users The user service to compare the user credentials with.
   */
  public constructor(private readonly _users: ZUsersClient) {}

  /**
   * Returns whether or not the request can continue.
   *
   * @param context The execution context that contains the http request body.
   *
   * @returns A promise that resolves to true if the credentials are correct.  Returns a rejected promise
   *          if the credentials don't match.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const login = context.switchToHttp().getRequest().body as IZLogin;
    const valid = await this._users.compare(new ZLoginBuilder().copy(login).build());
    ZAssert.claim(valid, 'Your credentials are incorrect.  Please try again.').assert((msg) => new UnauthorizedException(msg));
    // The user has logged in at this point.
    return true;
  }
}
