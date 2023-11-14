import { ForbiddenException, Injectable } from '@nestjs/common';
import { ZAssert } from '@zthun/helpful-obligation';
import { IZUser } from '@zthun/works.core';
import { ZRuleCookieRequiresAuth } from './rule-cookie-requires-auth.guard';

@Injectable()
/**
 * Represents a rule that requires the user to be a regular user.
 */
export class ZRuleCookieRequiresAuthRegular extends ZRuleCookieRequiresAuth {
  /**
   * Asserts that the user is not the super user.
   *
   * @param user The user to check.
   *
   * @throws ForbiddenException if the user is the super user.
   */
  public claim(user: IZUser | null) {
    ZAssert.claim(!!user && !user.super, 'You cannot perform this action on the super user.').assert(
      (msg) => new ForbiddenException(msg)
    );
  }
}
