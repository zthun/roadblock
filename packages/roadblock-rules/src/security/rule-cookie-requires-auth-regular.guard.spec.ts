import { ForbiddenException } from '@nestjs/common';
import { ZUserBuilder } from '@zthun/works.core';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { ZRuleCookieRequiresAuthRegular } from './rule-cookie-requires-auth-regular.guard';
import { ZSecurityService } from './security.service';

describe('ZRuleCookieRequiresAuthRegular', () => {
  function createTestTarget() {
    return new ZRuleCookieRequiresAuthRegular(mock<ZSecurityService>());
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
    expect(() => target.claim(new ZUserBuilder().super().build())).toThrow(ForbiddenException);
  });

  it('throws a ForbiddenException if the user is falsy.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    // Assert
    expect(() => target.claim(null)).toThrow(ForbiddenException);
  });
});
