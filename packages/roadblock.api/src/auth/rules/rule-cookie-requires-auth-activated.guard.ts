import { ForbiddenException, Injectable } from '@nestjs/common';
import { IZUser, ZAssert } from '@zthun/works.core';
import { ZRuleCookieRequiresAuth } from './rule-cookie-requires-auth.guard';

@Injectable()
/**
 * A rule that requires the user represented by the auth cookie to be activated.
 */
export class ZRuleCookieRequiresAuthActivated extends ZRuleCookieRequiresAuth {
  /**
   * Checks to see if user has been activated.
   *
   * @param user The user to check.
   *
   * @throws A ForbiddenException if the user is not activated.
   */
  public claim(user: IZUser) {
    ZAssert.claim(!user.activator, 'Your account has not been activated.  Please activate your account before performing this action.').assert((msg) => new ForbiddenException(msg));
  }
}
