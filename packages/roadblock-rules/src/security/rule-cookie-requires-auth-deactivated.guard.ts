import { ConflictException, Injectable } from '@nestjs/common';
import { ZAssert } from '@zthun/helpful-obligation';
import { IZUser } from '@zthun/works.core';
import { ZRuleCookieRequiresAuth } from './rule-cookie-requires-auth.guard';

@Injectable()
/**
 * Represents a rule that the user represented by the auth cookie be deactivated.
 */
export class ZRuleCookieRequiresAuthDeactivated extends ZRuleCookieRequiresAuth {
  /**
   * Asserts that the user is deactivated.
   *
   * @param user The user to check.
   *
   * @throws ConflictException if the user is activated.
   */
  public claim(user: IZUser | null) {
    ZAssert.claim(!!user?.activator, 'This account has already been activated.').assert(
      (msg) => new ConflictException(msg)
    );
  }
}
