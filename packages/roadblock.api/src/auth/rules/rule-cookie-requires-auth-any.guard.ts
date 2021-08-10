import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IZUser, ZAssert } from '@zthun/works.core';
import { ZRuleCookieRequiresAuth } from './rule-cookie-requires-auth.guard';

@Injectable()
/**
 * Represents a rule that the cookie requires some kind of authentication.
 */
export class ZRuleCookieRequiresAuthAny extends ZRuleCookieRequiresAuth {
  /**
   * Asserts that the user is truthy.
   *
   * @param user The user to check.
   *
   * @throws UnauthorizedException if user is falsy.
   */
  public claim(user: IZUser) {
    ZAssert.claim(!!user, 'You are not authenticated.  Please log in.').assert((msg) => new UnauthorizedException(msg));
  }
}
