/* eslint-disable require-jsdoc */
import { ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { ZRuleCookieRequiresAuthRegular } from './rule-cookie-requires-auth-regular.guard';

describe('ZRuleCookieRequiresAuthRegular', () => {
  function createTestTarget() {
    return new ZRuleCookieRequiresAuthRegular(createMocked(['extract']));
  }

  it('does nothing if all rules pass', () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().build())).not.toThrow();
  });

  it('throws a ForbiddenException if the user is a super user.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().super().build())).toThrow();
  });
});
