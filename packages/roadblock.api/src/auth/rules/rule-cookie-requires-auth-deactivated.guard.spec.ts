/* eslint-disable require-jsdoc */
import { ConflictException } from '@nestjs/common';
import { ZUserBuilder } from '@zthun/works.core';
import { createMocked } from '@zthun/works.jest';
import { v4 } from 'uuid';
import { ZRuleCookieRequiresAuthDeactivated } from './rule-cookie-requires-auth-deactivated.guard';

describe('ZRuleCookieRequestAuthAny', () => {
  function createTestTarget() {
    return new ZRuleCookieRequiresAuthDeactivated(createMocked(['extract']));
  }

  it('does nothing if all rules pass', () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().inactive(v4()).build())).not.toThrow();
  });

  it('throws a ConflictException if the user is not activated.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(new ZUserBuilder().active().build())).toThrow(ConflictException);
  });
});
