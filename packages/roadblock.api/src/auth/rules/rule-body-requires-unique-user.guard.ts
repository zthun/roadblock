import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { ZAssert } from '@zthun/works.core';
import { ZUsersService } from '../../users/users.service';

@Injectable()
/**
 * A rule that states that the request body must contain a user email that is not already in the system.
 */
export class ZRuleBodyRequiresUniqueUser implements CanActivate {
  /**
   * Initializes a new instance of this object.
   *
   * @param _users The user service that is used to search for the user email.
   */
  public constructor(private readonly _users: ZUsersService) {}

  /**
   * Gets whether or not the request can continue.
   *
   * @param context The context that contains the http request.
   *
   * @returns A resolved promise if the email contained in the body does not exist in the system.
   *          Returns a rejected promise if it is already available.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { email } = context.switchToHttp().getRequest().body;
    const user = await this._users.findByEmail(email);
    ZAssert.claim(!user, `Email, ${email}, is not available.`).assert((msg) => new ConflictException(msg));
    return true;
  }
}
